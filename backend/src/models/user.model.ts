import mongoose, { Schema } from "mongoose";
import { IUser } from "../types/user.types";
import bcrypt from "bcryptjs";

// Mongoose schema for User
const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastname: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    address: {
      street: {
        type: String,
        required: [true, "Street address is required"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
      },
      zipCode: {
        type: String,
        required: [true, "ZIP code is required"],
        trim: true,
      },
      country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
        default: "United States",
      },
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number"],
    },
    email: {
      type: String,
      required: false,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    healthConditions: {
      type: [String],
      default: [],
      validate: {
        validator: function (conditions: string[]) {
          return conditions.every((condition) => condition.trim().length > 0);
        },
        message: "Health conditions cannot be empty strings",
      },
    },
    allergies: {
      type: [String],
      default: [],
      validate: {
        validator: function (allergies: string[]) {
          return allergies.every((allergy) => allergy.trim().length > 0);
        },
        message: "Allergies cannot be empty strings",
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstname} ${this.lastname}`;
});

// Virtual for full address
userSchema.virtual("fullAddress").get(function () {
  const addr = this.address as {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}, ${addr.country}`;
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ lastname: 1, firstname: 1 });

// Pre-save middleware to hash password and ensure arrays don't contain duplicates
userSchema.pre("save", async function (next) {
  // Hash password if it's modified
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }

  // Remove duplicates from arrays
  if (this.healthConditions && Array.isArray(this.healthConditions)) {
    this.healthConditions = [...new Set(this.healthConditions)];
  }

  if (this.allergies && Array.isArray(this.allergies)) {
    this.allergies = [...new Set(this.allergies)];
  }

  next();
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Static method to find user by email or phone number
userSchema.statics.findByEmailOrPhone = function (identifier: string) {
  return this.findOne({
    $or: [{ email: identifier }, { phoneNumber: identifier }],
  });
};

// Instance method to add health condition
userSchema.methods.addHealthCondition = function (condition: string) {
  if (!this.healthConditions.includes(condition.trim())) {
    this.healthConditions.push(condition.trim());
  }
  return this.save();
};

// Instance method to add allergy
userSchema.methods.addAllergy = function (allergy: string) {
  if (!this.allergies.includes(allergy.trim())) {
    this.allergies.push(allergy.trim());
  }
  return this.save();
};

// Instance method to remove health condition
userSchema.methods.removeHealthCondition = function (condition: string) {
  this.healthConditions = this.healthConditions.filter(
    (cond: string) => cond.toLowerCase() !== condition.toLowerCase()
  );
  return this.save();
};

// Instance method to remove allergy
userSchema.methods.removeAllergy = function (allergy: string) {
  this.allergies = this.allergies.filter(
    (allergyItem: string) => allergyItem.toLowerCase() !== allergy.toLowerCase()
  );
  return this.save();
};

// Create and export the model
const User = mongoose.model<IUser>("User", userSchema);

export default User;
