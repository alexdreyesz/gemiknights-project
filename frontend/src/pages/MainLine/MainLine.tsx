import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MainLine: React.FC = () => {
  // Mock user data - in real app this would come from your backend
  const [userData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main Street, City, State 12345',
    phoneNumber: '+1 (555) 123-4567',
    email: 'john.doe@example.com',
    medicalConditions: 'Diabetes Type 2, Hypertension',
    allergies: 'Penicillin, Peanuts'
  });

  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [currentEmergency, setCurrentEmergency] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  const emergencyTypes = [
    {
      id: 'heart-attack',
      title: 'Heart Attack',
      description: 'Chest pain, shortness of breath',
      icon: '🫀',
      color: 'bg-red-600',
      hoverColor: 'hover:bg-red-700'
    },
    {
      id: 'choking',
      title: 'Choking',
      description: 'Unable to breathe, coughing',
      icon: '😵',
      color: 'bg-orange-600',
      hoverColor: 'hover:bg-orange-700'
    },
    {
      id: 'stroke',
      title: 'Stroke',
      description: 'Face drooping, speech problems',
      icon: '🧠',
      color: 'bg-purple-600',
      hoverColor: 'hover:bg-purple-700'
    },
    {
      id: 'dangerous-situation',
      title: 'Dangerous Situation',
      description: 'Threat, violence, accident',
      icon: '⚠️',
      color: 'bg-yellow-600',
      hoverColor: 'hover:bg-yellow-700'
    },
    {
      id: 'medical-emergency',
      title: 'Medical Emergency',
      description: 'Other urgent medical needs',
      icon: '🏥',
      color: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700'
    },
    {
      id: 'fall-injury',
      title: 'Fall or Injury',
      description: 'Broken bones, head injury',
      icon: '🩹',
      color: 'bg-green-600',
      hoverColor: 'hover:bg-green-700'
    }
  ];

  const handleEmergency = async (emergencyType: string) => {
    setIsEmergencyActive(true);
    setCurrentEmergency(emergencyType);
    
    // Simulate AI processing and emergency response
    const emergency = emergencyTypes.find(e => e.id === emergencyType);
    
    // Simulate AI generating response with user data
    const aiMessage = `EMERGENCY ALERT: ${emergency?.title.toUpperCase()}

Patient Information:
- Name: ${userData.firstName} ${userData.lastName}
- Address: ${userData.address}
- Phone: ${userData.phoneNumber}
- Email: ${userData.email}

Medical Information:
- Conditions: ${userData.medicalConditions}
- Allergies: ${userData.allergies}

Emergency Type: ${emergency?.title}
Location: ${userData.address}
Time: ${new Date().toLocaleString()}

AI Assistant: I'm connecting you with emergency services. Please stay calm. Help is on the way. I'm sharing all patient information with dispatch now.`;

    setAiResponse(aiMessage);
    
    // Simulate calling 911
    setTimeout(() => {
      // In real app, this would trigger actual emergency call
      console.log('Calling 911...');
    }, 1000);
  };

  const cancelEmergency = () => {
    setIsEmergencyActive(false);
    setCurrentEmergency('');
    setAiResponse('');
  };

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
              <span className="ml-2 text-xl font-bold text-gray-900">Main Line</span>
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
              Tap the emergency button that matches your situation. AI will immediately share your information with emergency services.
            </p>
          </div>

          {!isEmergencyActive ? (
            /* Emergency Buttons Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {emergencyTypes.map((emergency) => (
                <button
                  key={emergency.id}
                  onClick={() => handleEmergency(emergency.id)}
                  className={`${emergency.color} ${emergency.hoverColor} text-white rounded-xl shadow-lg p-6 sm:p-8 transition-all duration-300 transform hover:scale-105 hover:shadow-xl`}
                >
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl mb-4">{emergency.icon}</div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">{emergency.title}</h3>
                    <p className="text-sm sm:text-base opacity-90">{emergency.description}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* Emergency Active Interface */
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8">
                {/* Emergency Status */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">
                    EMERGENCY ACTIVE
                  </h2>
                  <p className="text-gray-600">
                    {emergencyTypes.find(e => e.id === currentEmergency)?.title} - Connecting to emergency services...
                  </p>
                </div>

                {/* AI Response */}
                <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">AI</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">AI Assistant Response</h3>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-l-4 border-red-600">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                      {aiResponse}
                    </pre>
                  </div>
                </div>

                {/* User Information Being Shared */}
                <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Information Being Shared
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Name:</span> {userData.firstName} {userData.lastName}
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Phone:</span> {userData.phoneNumber}
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-medium text-gray-700">Address:</span> {userData.address}
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-medium text-gray-700">Medical Conditions:</span> {userData.medicalConditions}
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-medium text-gray-700">Allergies:</span> {userData.allergies}
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
          )}

          {/* Safety Information */}
          {!isEmergencyActive && (
            <div className="mt-12 text-center">
              <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Important Safety Information</h3>
                <p className="text-gray-600 text-sm">
                  This app connects you directly to emergency services. Only use in genuine emergencies. 
                  False alarms can delay response to real emergencies and may result in legal consequences.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainLine;
