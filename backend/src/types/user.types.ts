import { Document } from "mongoose";

interface IAddress {
  street: string;
  building?: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
}

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  password: string;
  fullName: string;
  address: IAddress;
  fullAddress: string;
  phoneNumber: string;
  email?: string;
  healthConditions: string[];
  allergies: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  addHealthCondition(condition: string): Promise<IUser>;
  removeHealthCondition(condition: string): Promise<IUser>;
  addAllergy(allergy: string): Promise<IUser>;
  removeAllergy(allergy: string): Promise<IUser>;
}

export interface ICreateUser {
  firstname: string;
  lastname: string;
  password: string;
  address: IAddress;
  phoneNumber: string;
  email?: string;
  healthConditions?: string[];
  allergies?: string[];
}

export interface IUpdateUser {
  firstname?: string;
  lastname?: string;
  password?: string;
  address?: IAddress;
  phoneNumber?: string;
  email?: string;
  healthConditions?: string[];
  allergies?: string[];
}

export interface IUserResponse {
  id: string;
  firstname: string;
  lastname: string;
  fullName: string;
  address: IAddress;
  fullAddress: string;
  phoneNumber: string;
  email?: string;
  healthConditions: string[];
  allergies: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoginRequest {
  identifier: string; // email or phone number
  password: string;
}

export interface ILoginResponse {
  message: string;
  token: string;
  user: IUserResponse;
}
