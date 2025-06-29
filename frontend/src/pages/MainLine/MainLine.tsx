import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

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

interface EmergencySummary {
  summary: string;
  urgency: string;
  keyPoints: string[];
}

const MainLine: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [emergencySummary, setEmergencySummary] =
    useState<EmergencySummary | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // First try to get user data from localStorage
        const userStr = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!userStr || !token) {
          setError("No user data found. Please log in.");
          setLoading(false);
          navigate("/log-in");
          return;
        }

        const localUserData = JSON.parse(userStr);
        setUserData(localUserData);

        // Optionally fetch fresh data from backend
        try {
          const response = await fetch(
            "http://localhost:3000/api/auth/profile",
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
        navigate("/log-in");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  // Check if emergency mode should be activated
  useEffect(() => {
    const emergencyParam = searchParams.get("emergency");
    if (emergencyParam === "true" && userData && !isEmergencyActive) {
      activateEmergency();
    }
  }, [searchParams, userData, isEmergencyActive]);

  const getEmergencySummary = async () => {
    if (!userData) return;

    setSummaryLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        "http://localhost:3000/api/emergency/analyze",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: userData.firstname,
            healthConditions: userData.healthConditions,
            allergies: userData.allergies,
            emergencyType: "Medical Emergency",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get emergency summary");
      }

      const result = await response.json();
      setEmergencySummary(result.summary);
    } catch (err: any) {
      console.error("Error getting emergency summary:", err);
      // Continue with basic emergency response even if summary fails
    } finally {
      setSummaryLoading(false);
    }
  };

  const activateEmergency = async () => {
    if (!userData) return;

    setIsEmergencyActive(true);

    // Generate basic AI response with user data
    const aiMessage = `EMERGENCY ALERT: MEDICAL EMERGENCY

Patient Information:
- Name: ${userData.firstname} ${userData.lastname}
- Address: ${userData.fullAddress}
- Phone: ${userData.phoneNumber}
- Email: ${userData.email || "Not provided"}

Medical Information:
- Conditions: ${
      userData.healthConditions.length > 0
        ? userData.healthConditions.join(", ")
        : "None listed"
    }
- Allergies: ${
      userData.allergies.length > 0
        ? userData.allergies.join(", ")
        : "None listed"
    }

Emergency Type: Medical Emergency
Location: ${userData.fullAddress}
Time: ${new Date().toLocaleString()}

AI Assistant: I'm connecting you with emergency services. Please stay calm. Help is on the way. I'm sharing all patient information with dispatch now.`;

    setAiResponse(aiMessage);

    // Get AI summary from Gemini
    await getEmergencySummary();

    // Simulate calling 911
    setTimeout(() => {
      // In real app, this would trigger actual emergency call
      console.log("Calling 911...");
    }, 1000);
  };

  const cancelEmergency = () => {
    setIsEmergencyActive(false);
    setAiResponse("");
    setEmergencySummary(null);
    navigate("/user-profile");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading emergency interface...</p>
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

  // If not in emergency mode, show a simple interface
  if (!isEmergencyActive) {
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
              <div className="flex gap-3">
                <Link
                  to="/user-profile"
                  className="text-gray-600 hover:text-red-600 transition-colors text-sm font-medium"
                >
                  Profile
                </Link>
                <Link
                  to="/"
                  className="text-gray-600 hover:text-red-600 transition-colors text-sm font-medium"
                >
                  Home
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Emergency Response
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              This page is for emergency situations only. Please use the
              emergency button on your profile page to activate emergency
              services.
            </p>
            <Link to="/user-profile">
              <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                Go to Profile
              </button>
            </Link>
          </div>
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
            <div className="flex gap-3">
              <Link
                to="/user-profile"
                className="text-gray-600 hover:text-red-600 transition-colors text-sm font-medium"
              >
                Profile
              </Link>
              <Link
                to="/"
                className="text-gray-600 hover:text-red-600 transition-colors text-sm font-medium"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Emergency Response
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              AI is analyzing your medical information and connecting you with
              emergency services.
            </p>
          </div>

          {/* Emergency Active Interface */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8">
              {/* Emergency Status */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <svg
                    className="w-10 h-10 text-white"
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
                <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">
                  EMERGENCY ACTIVE
                </h2>
                <p className="text-gray-600">
                  Medical Emergency - Connecting to emergency services...
                </p>
              </div>

              {/* AI Response */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">AI</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    AI Assistant Response
                  </h3>
                </div>
                <div className="bg-white rounded-lg p-4 border-l-4 border-red-600">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                    {aiResponse}
                  </pre>
                </div>
              </div>

              {/* Gemini AI Summary */}
              {summaryLoading && (
                <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-6">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">AI</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      AI Medical Analysis
                    </h3>
                  </div>
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">
                      Analyzing medical conditions and generating emergency
                      guidance...
                    </p>
                  </div>
                </div>
              )}

              {emergencySummary && (
                <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">AI</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      AI Medical Analysis
                    </h3>
                  </div>

                  {/* Main Summary - Audio Style */}
                  <div className="bg-white rounded-lg p-6 border-l-4 border-blue-600 mb-4">
                    <div className="flex items-center mb-3">
                      <div className="w-4 h-4 bg-blue-600 rounded-full mr-3 animate-pulse"></div>
                      <span className="text-sm font-medium text-blue-600">
                        AI ASSISTANT SPEAKING
                      </span>
                    </div>
                    <p className="text-gray-800 text-lg leading-relaxed">
                      {emergencySummary.summary}
                    </p>
                  </div>

                  {/* Urgency and Key Points */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Urgency Level */}
                    <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                      <h4 className="font-semibold text-red-700 mb-2">
                        Urgency Level
                      </h4>
                      <div className="flex items-center">
                        <span
                          className={`inline-block w-3 h-3 rounded-full mr-2 ${
                            emergencySummary.urgency === "high"
                              ? "bg-red-500"
                              : emergencySummary.urgency === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        ></span>
                        <span className="text-gray-700 capitalize font-medium">
                          {emergencySummary.urgency} priority
                        </span>
                      </div>
                    </div>

                    {/* Key Points */}
                    <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                      <h4 className="font-semibold text-green-700 mb-2">
                        Key Information
                      </h4>
                      <ul className="text-sm space-y-1">
                        {emergencySummary.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            <span className="text-gray-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* User Information Being Shared */}
              <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Information Being Shared
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>{" "}
                    {userData.firstname} {userData.lastname}
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>{" "}
                    {userData.phoneNumber}
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-medium text-gray-700">Address:</span>{" "}
                    {userData.fullAddress}
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-medium text-gray-700">
                      Medical Conditions:
                    </span>{" "}
                    {userData.healthConditions.length > 0
                      ? userData.healthConditions.join(", ")
                      : "None listed"}
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-medium text-gray-700">
                      Allergies:
                    </span>{" "}
                    {userData.allergies.length > 0
                      ? userData.allergies.join(", ")
                      : "None listed"}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={cancelEmergency}
                  className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  Cancel Emergency
                </button>
                <button className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                  Call 911 Now
                </button>
              </div>
            </div>
          </div>

          {/* Safety Information */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Important Safety Information
              </h3>
              <p className="text-gray-600 text-sm">
                This app connects you directly to emergency services. Only use
                in genuine emergencies. False alarms can delay response to real
                emergencies and may result in legal consequences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLine;
