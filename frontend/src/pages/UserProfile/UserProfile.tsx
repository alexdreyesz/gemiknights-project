import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

interface UserData {
  id: string;
  firstname: string;
  lastname: string;
  fullName: string;
  address: {
    street: string;
    building?: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  fullAddress: string;
  phoneNumber: string;
  email?: string;
  healthConditions: string[];
  allergies: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [newData, setNewData] = useState({
    newCondition: "",
    newAllergy: "",
    newAddress: "",
    description: "",
  });

  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // First try to get user data from localStorage
        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!userStr || !token) {
          setError("No user data found. Please log in.");
          setLoading(false);
          return;
        }

        const localUserData = JSON.parse(userStr);
        setUserData(localUserData);

        // Optionally fetch fresh data from backend
        try {
          const response = await fetch(
            "http://localhost:3000/api/users/profile",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const result = await response.json();
            setUserData(result.user);
            localStorage.setItem("user", JSON.stringify(result.user));
          }
        } catch (fetchError) {
          console.log("Could not fetch fresh data, using localStorage data");
        }
      } catch (err) {
        console.error("Error loading user data:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/log-in");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddInfo = async (type: string) => {
    if (newData[type as keyof typeof newData] && userData) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          return;
        }

        let endpoint = "";
        let data = {};

        if (type === "newCondition") {
          endpoint = "health-conditions";
          data = { condition: newData.newCondition };
        } else if (type === "newAllergy") {
          endpoint = "allergies";
          data = { allergy: newData.newAllergy };
        }

        const response = await fetch(
          `http://localhost:3000/api/users/${userData.id}/${endpoint}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to add information");
        }

        const result = await response.json();

        // Update local state with the new data from backend
        setUserData(result.user);
        localStorage.setItem("user", JSON.stringify(result.user));

        // Clear the input field
        setNewData((prev) => ({ ...prev, [type]: "" }));

        console.log(
          `${
            type === "newCondition" ? "Health condition" : "Allergy"
          } added successfully`
        );
      } catch (err: any) {
        console.error("Error adding information:", err);
        setError(err.message || "Failed to add information");
      }
    }
  };

  const handleRemoveInfo = async (type: string, item: string) => {
    if (!userData) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      let endpoint = "";
      if (type === "healthConditions") {
        endpoint = `health-conditions/${encodeURIComponent(item)}`;
      } else if (type === "allergies") {
        endpoint = `allergies/${encodeURIComponent(item)}`;
      }

      const response = await fetch(
        `http://localhost:3000/api/users/${userData.id}/${endpoint}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove information");
      }

      const result = await response.json();

      // Update local state with the new data from backend
      setUserData(result.user);
      localStorage.setItem("user", JSON.stringify(result.user));

      console.log(
        `${
          type === "healthConditions" ? "Health condition" : "Allergy"
        } removed successfully`
      );
    } catch (err: any) {
      console.error("Error removing information:", err);
      setError(err.message || "Failed to remove information");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "No user data found"}</p>
          <Link
            to="/log-in"
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">
                Main Line
              </span>
            </div>
            <div className="flex gap-4">
              <Link
                to="/"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Main Page
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Your Profile
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your emergency information is ready to be shared with first
              responders when needed.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Personal Information
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      First Name
                    </label>
                    <p className="text-gray-900 font-medium">
                      {userData.firstname}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Last Name
                    </label>
                    <p className="text-gray-900 font-medium">
                      {userData.lastname}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900 font-medium">
                      {userData.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Phone
                    </label>
                    <p className="text-gray-900 font-medium">
                      {userData.phoneNumber}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                      Address
                    </label>
                    <p className="text-gray-900 font-medium">
                      {userData.fullAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Medical Information Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <svg
                      className="w-6 h-6 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Medical Information
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="info-section">
                    <h3>Health Conditions</h3>
                    {userData.healthConditions.length > 0 ? (
                      <div className="items-list">
                        {userData.healthConditions.map((condition, index) => (
                          <div key={index} className="item-with-remove">
                            <span>{condition}</span>
                            <button
                              onClick={() =>
                                handleRemoveInfo("healthConditions", condition)
                              }
                              className="remove-btn"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-data">No health conditions listed</p>
                    )}
                    <div className="add-section">
                      <input
                        type="text"
                        placeholder="Add health condition"
                        value={newData.newCondition}
                        onChange={(e) =>
                          setNewData((prev) => ({
                            ...prev,
                            newCondition: e.target.value,
                          }))
                        }
                      />
                      <button onClick={() => handleAddInfo("newCondition")}>
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="info-section">
                    <h3>Allergies</h3>
                    {userData.allergies.length > 0 ? (
                      <div className="items-list">
                        {userData.allergies.map((allergy, index) => (
                          <div key={index} className="item-with-remove">
                            <span>{allergy}</span>
                            <button
                              onClick={() =>
                                handleRemoveInfo("allergies", allergy)
                              }
                              className="remove-btn"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-data">No allergies listed</p>
                    )}
                    <div className="add-section">
                      <input
                        type="text"
                        placeholder="Add allergy"
                        value={newData.newAllergy}
                        onChange={(e) =>
                          setNewData((prev) => ({
                            ...prev,
                            newAllergy: e.target.value,
                          }))
                        }
                      />
                      <button onClick={() => handleAddInfo("newAllergy")}>
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Button */}
            <div className="bg-red-600 rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Emergency Alert
              </h3>
              <p className="text-red-100 text-sm mb-4">
                Tap to alert emergency services with your location and medical
                information
              </p>
              <Link to="/main-line">
                <button className="w-full bg-white text-red-600 py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  EMERGENCY
                </button>
              </Link>
            </div>

            {/* Additional Description */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Notes
              </h3>
              <textarea
                name="description"
                value={newData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors resize-none text-sm"
                placeholder="Add any additional information that emergency responders should know..."
              />
              <button className="mt-3 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                Save Notes
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/create-profile"
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors text-center"
            >
              Edit Profile
            </Link>
            <button className="border-2 border-red-600 text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-colors">
              Download Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

// Add CSS styles for the new UI elements
const styles = `
  .info-section {
    margin-bottom: 1.5rem;
  }
  
  .info-section h3 {
    font-size: 1rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
  }
  
  .items-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .item-with-remove {
    display: flex;
    align-items: center;
    background-color: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
    color: #374151;
  }
  
  .remove-btn {
    background: none;
    border: none;
    color: #ef4444;
    font-size: 1.125rem;
    font-weight: bold;
    cursor: pointer;
    margin-left: 0.5rem;
    padding: 0;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    transition: background-color 0.2s;
  }
  
  .remove-btn:hover {
    background-color: #fee2e2;
  }
  
  .add-section {
    display: flex;
    gap: 0.5rem;
  }
  
  .add-section input {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
  }
  
  .add-section input:focus {
    outline: none;
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
  
  .add-section button {
    padding: 0.5rem 1rem;
    background-color: #ef4444;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .add-section button:hover {
    background-color: #dc2626;
  }
  
  .no-data {
    color: #6b7280;
    font-style: italic;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }
`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
