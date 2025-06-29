import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import {
  GoogleGenAI,
} from '@google/genai';

async function main() {
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });
  const config = {
    thinkingConfig: {
      thinkingBudget: -1,
    },
    responseMimeType: 'text/plain',
  };
  const model = 'gemini-2.5-pro';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `INSERT_INPUT_HERE`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  let fileIndex = 0;
  for await (const chunk of response) {
    console.log(chunk.text);
  }
}

main();

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
  const [geminiAnalysis, setGeminiAnalysis] = useState("");
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [dispatcherCommunication, setDispatcherCommunication] = useState("");
  const [dispatcherLoading, setDispatcherLoading] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [soundUrl, setSoundUrl] = useState("");
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmissionData, setTransmissionData] = useState("");

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

  const analyzeWithGemini = async () => {
    if (!userData) return;

    setGeminiLoading(true);
    setGeminiAnalysis("");

    try {
      const ai = new GoogleGenAI({
        apiKey: import.meta.env.VITE_GEMINI_API_KEY,
      });
      
      const config = {
        thinkingConfig: {
          thinkingBudget: -1,
        },
        responseMimeType: 'text/plain',
      };
      
      const model = 'gemini-2.5-pro';
      
      const prompt = `EMERGENCY MEDICAL ANALYSIS REQUEST

Patient Information:
- Name: ${userData.firstname} ${userData.lastname}
- Age: ${userData.createdAt ? Math.floor((Date.now() - new Date(userData.createdAt).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) : 'Unknown'} years old
- Medical Conditions: ${userData.healthConditions.length > 0 ? userData.healthConditions.join(", ") : "None listed"}
- Allergies: ${userData.allergies.length > 0 ? userData.allergies.join(", ") : "None listed"}
- Location: ${userData.fullAddress}

Emergency Type: Medical Emergency

Please provide:
1. A brief medical assessment based on the patient's conditions
2. Potential emergency complications to watch for
3. Immediate first aid recommendations if applicable
4. Priority level for emergency response (high/medium/low)
5. Key information for emergency responders

Format your response as a clear, concise medical analysis suitable for emergency dispatch.`;

      const contents = [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ];

      const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
      });

      let fullResponse = "";
      for await (const chunk of response) {
        if (chunk.text) {
          fullResponse += chunk.text;
          setGeminiAnalysis(fullResponse);
        }
      }

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setGeminiAnalysis("AI analysis temporarily unavailable. Emergency services have been notified with your information.");
    } finally {
      setGeminiLoading(false);
    }
  };

  const simulateDispatcherCall = async () => {
    if (!userData) return;

    setDispatcherLoading(true);
    setDispatcherCommunication("");

    try {
      const ai = new GoogleGenAI({
        apiKey: import.meta.env.VITE_GEMINI_API_KEY,
      });
      
      const config = {
        thinkingConfig: {
          thinkingBudget: -1,
        },
        responseMimeType: 'text/plain',
      };
      
      const model = 'gemini-2.5-pro';
      
      const prompt = `You are an AI talking to a 911 dispatcher Please provide as much information as possible to the dispatcher. Please do not add the dispatcher conversation only the AI one but still simulate the conversation. 

Emergency Type: Medical Emergency
Location: ${userData.fullAddress}

Patient Information:
- Name: ${userData.firstname} ${userData.lastname}
- Address: ${userData.fullAddress}
- Phone: ${userData.phoneNumber}
- Medical Conditions: ${userData.healthConditions.length > 0 ? userData.healthConditions.join(", ") : "None listed"}
- Allergies: ${userData.allergies.length > 0 ? userData.allergies.join(", ") : "None listed"}

Please simulate a realistic 911 dispatch conversation. Include:
1. Initial greeting and emergency confirmation
2. Gathering essential information
3. Providing reassurance and instructions
4. Confirming dispatch of emergency services
5. Staying on the line until help arrives

Be professional, calm, and reassuring.`;

      const contents = [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ];

      const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
      });

      let fullResponse = "";
      for await (const chunk of response) {
        if (chunk.text) {
          fullResponse += chunk.text;
          setDispatcherCommunication(fullResponse);
        }
      }

    } catch (error) {
      console.error("Error calling Gemini API for dispatcher:", error);
      setDispatcherCommunication("Dispatcher communication temporarily unavailable. Emergency services have been notified.");
    } finally {
      setDispatcherLoading(false);
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
    
    // Start Gemini analysis
    analyzeWithGemini();
    
    // Start dispatcher simulation
    simulateDispatcherCall();

    // Simulate calling 911
    setTimeout(() => {
      // In real app, this would trigger actual emergency call
      console.log("Calling 911...");
    }, 1000);
  };

  const readDispatcherMessage = () => {
    if (!dispatcherCommunication) return;

    // Stop any existing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    // Create speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(dispatcherCommunication);
    
    // Configure voice settings for emergency/dispatch style
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0; // Normal pitch
    utterance.volume = 1.0; // Full volume
    
    // Try to use a male voice if available (typical for dispatchers)
    const voices = window.speechSynthesis.getVoices();
    const maleVoice = voices.find(voice => 
      voice.name.includes('Male') || 
      voice.name.includes('David') || 
      voice.name.includes('James') ||
      voice.name.includes('Mark')
    );
    if (maleVoice) {
      utterance.voice = maleVoice;
    }

    // Event handlers
    utterance.onstart = () => setIsReading(true);
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);

    // Start speaking
    window.speechSynthesis.speak(utterance);
  };

  const generateSoundTransmission = () => {
    if (!soundUrl.trim()) return;

    setIsTransmitting(true);
    setTransmissionData("");

    // Simulate sound-based data transmission
    const transmissionText = `SOUND-BASED DATA TRANSMISSION INITIATED

URL: ${soundUrl}
Timestamp: ${new Date().toLocaleString()}
Frequency: 2.4 GHz
Modulation: FSK (Frequency-Shift Keying)
Data Rate: 1200 bps

Transmission Protocol:
- Converting URL to audio frequency patterns
- Encoding patient data in sound waves
- Broadcasting emergency information via acoustic channels
- Establishing secure audio communication link

Patient Data Encoded:
- Name: ${userData?.firstname} ${userData?.lastname}
- Location: ${userData?.fullAddress}
- Medical Conditions: ${userData?.healthConditions?.join(", ") || "None"}
- Allergies: ${userData?.allergies?.join(", ") || "None"}

Audio Transmission Status: ACTIVE
Signal Strength: 85%
Data Integrity: 98.2%
Connection: ESTABLISHED

Transmitting emergency data through sound-based protocol...`;

    // Simulate real-time transmission
    let currentText = "";
    const words = transmissionText.split(" ");
    let wordIndex = 0;

    const transmissionInterval = setInterval(() => {
      if (wordIndex < words.length) {
        currentText += words[wordIndex] + " ";
        setTransmissionData(currentText);
        wordIndex++;
      } else {
        clearInterval(transmissionInterval);
        setIsTransmitting(false);
      }
    }, 100);

    // Cleanup on unmount
    return () => clearInterval(transmissionInterval);
  };

  const playTransmissionSound = () => {
    if (!transmissionData) return;

    // Create audio context for sound generation
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Generate a series of tones to represent data transmission
    const frequencies = [800, 1200, 1600, 2000]; // Different frequencies for data encoding
    let currentIndex = 0;

    const playTone = () => {
      if (currentIndex >= frequencies.length) {
        audioContext.close();
        return;
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequencies[currentIndex], audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);

      currentIndex++;
      setTimeout(playTone, 600);
    };

    playTone();
  };

  const cancelEmergency = () => {
    setIsEmergencyActive(false);
    setAiResponse("");
    setEmergencySummary(null);
    setGeminiAnalysis("");
    setGeminiLoading(false);
    setDispatcherCommunication("");
    setDispatcherLoading(false);
    setIsReading(false);
    setSoundUrl("");
    setIsTransmitting(false);
    setTransmissionData("");
    // Stop any ongoing speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
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

              {/* Gemini AI Analysis Results */}
              {geminiLoading && (
                <div className="bg-green-50 rounded-lg p-4 sm:p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">AI</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Gemini AI Medical Analysis
                    </h3>
                  </div>
                  <div className="bg-white rounded-lg p-6 border-l-4 border-green-600">
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-3"></div>
                      <p className="text-gray-600 font-medium">
                        Analyzing patient data and generating medical assessment...
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        This may take a few moments
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {geminiAnalysis && !geminiLoading && (
                <div className="bg-green-50 rounded-lg p-4 sm:p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">AI</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Gemini AI Medical Analysis
                    </h3>
                  </div>
                  <div className="bg-white rounded-lg p-6 border-l-4 border-green-600">
                    <div className="flex items-center mb-3">
                      <div className="w-4 h-4 bg-green-600 rounded-full mr-3 animate-pulse"></div>
                      <span className="text-sm font-medium text-green-600">
                        REAL-TIME AI ANALYSIS
                      </span>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                        {geminiAnalysis}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* 911 Dispatcher Communication */}
              {dispatcherLoading && (
                <div className="bg-red-50 rounded-lg p-4 sm:p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">911</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      911 Emergency Dispatch
                    </h3>
                  </div>
                  <div className="bg-white rounded-lg p-6 border-l-4 border-red-600">
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-3"></div>
                      <p className="text-gray-600 font-medium">
                        Connecting to 911 emergency services...
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Establishing communication with dispatcher
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {dispatcherCommunication && !dispatcherLoading && (
                <div className="bg-red-50 rounded-lg p-4 sm:p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">911</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        911 Emergency Dispatch
                      </h3>
                    </div>
                    <button
                      onClick={readDispatcherMessage}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isReading 
                          ? 'bg-red-600 text-white hover:bg-red-700' 
                          : 'bg-white text-red-600 border border-red-600 hover:bg-red-50'
                      }`}
                      title={isReading ? "Stop reading" : "Read aloud"}
                    >
                      {isReading ? (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                          </svg>
                          Stop
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                          Read Aloud
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-white rounded-lg p-6 border-l-4 border-red-600">
                    <div className="flex items-center mb-3">
                      <div className="w-4 h-4 bg-red-600 rounded-full mr-3 animate-pulse"></div>
                      <span className="text-sm font-medium text-red-600">
                        LIVE DISPATCHER COMMUNICATION
                      </span>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                        {dispatcherCommunication}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* Sound-Based Data Transmission */}
              <div className="bg-purple-50 rounded-lg p-4 sm:p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">🔊</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Sound-Based Transmission
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={generateSoundTransmission}
                      disabled={isTransmitting || !soundUrl.trim()}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isTransmitting || !soundUrl.trim()
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                      title="Start transmission"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                      {isTransmitting ? "Transmitting..." : "Transmit"}
                    </button>
                    {transmissionData && !isTransmitting && (
                      <button
                        onClick={playTransmissionSound}
                        className="flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-white text-purple-600 border border-purple-600 hover:bg-purple-50 transition-colors"
                        title="Play transmission sound"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                        </svg>
                        Play Sound
                      </button>
                    )}
                  </div>
                </div>
                
                {/* URL Input */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transmission URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={soundUrl}
                      onChange={(e) => setSoundUrl(e.target.value)}
                      placeholder="Enter URL for sound-based transmission..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      disabled={isTransmitting}
                    />
                  </div>
                </div>

                {/* Transmission Status */}
                {isTransmitting && (
                  <div className="bg-white rounded-lg p-6 border-l-4 border-purple-600">
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
                      <p className="text-gray-600 font-medium">
                        Converting data to sound frequencies...
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Encoding emergency information in audio signals
                      </p>
                    </div>
                  </div>
                )}

                {/* Transmission Results */}
                {transmissionData && !isTransmitting && (
                  <div className="bg-white rounded-lg p-6 border-l-4 border-purple-600">
                    <div className="flex items-center mb-3">
                      <div className="w-4 h-4 bg-purple-600 rounded-full mr-3 animate-pulse"></div>
                      <span className="text-sm font-medium text-purple-600">
                        SOUND-BASED TRANSMISSION COMPLETE
                      </span>
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                        {transmissionData}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

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
