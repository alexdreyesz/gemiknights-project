import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UserProfile: React.FC = () => {
  // Mock user data - in real app this would come from your backend
  const [userData, setUserData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main Street, City, State 12345',
    phoneNumber: '+1 (555) 123-4567',
    email: 'john.doe@example.com',
    medicalConditions: 'Diabetes Type 2, Hypertension',
    allergies: 'Penicillin, Peanuts'
  });

  const [newData, setNewData] = useState({
    newCondition: '',
    newAllergy: '',
    newAddress: '',
    description: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddInfo = (type: string) => {
    if (newData[type as keyof typeof newData]) {
      setUserData(prev => ({
        ...prev,
        [type === 'newCondition' ? 'medicalConditions' : 
         type === 'newAllergy' ? 'allergies' : 'address']: 
        prev[type === 'newCondition' ? 'medicalConditions' : 
            type === 'newAllergy' ? 'allergies' : 'address'] + 
        (prev[type === 'newCondition' ? 'medicalConditions' : 
            type === 'newAllergy' ? 'allergies' : 'address'] ? ', ' : '') + 
        newData[type as keyof typeof newData]
      }));
      setNewData(prev => ({ ...prev, [type]: '' }));
    }
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
            <Link 
              to="/" 
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Main Page
            </Link>
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
              Your emergency information is ready to be shared with first responders when needed.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
                    <p className="text-gray-900 font-medium">{userData.firstName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
                    <p className="text-gray-900 font-medium">{userData.lastName}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <p className="text-gray-900 font-medium">{userData.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                    <p className="text-gray-900 font-medium">{userData.phoneNumber}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                    <p className="text-gray-900 font-medium">{userData.address}</p>
                  </div>
                </div>
              </div>

              {/* Medical Information Card */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Medical Information</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Medical Conditions</label>
                    <p className="text-gray-900">{userData.medicalConditions || 'None listed'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Allergies</label>
                    <p className="text-gray-900">{userData.allergies || 'None listed'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Information Sidebar */}
            <div className="space-y-6">
              {/* Quick Add Section */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Information</h3>
                
                <div className="space-y-4">
                  {/* Add Medical Condition */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Medical Condition
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="newCondition"
                        value={newData.newCondition}
                        onChange={handleInputChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm"
                        placeholder="New condition"
                      />
                      <button
                        onClick={() => handleAddInfo('newCondition')}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Add Allergy */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Allergy
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="newAllergy"
                        value={newData.newAllergy}
                        onChange={handleInputChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm"
                        placeholder="New allergy"
                      />
                      <button
                        onClick={() => handleAddInfo('newAllergy')}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Add Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Address
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="newAddress"
                        value={newData.newAddress}
                        onChange={handleInputChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-sm"
                        placeholder="New address"
                      />
                      <button
                        onClick={() => handleAddInfo('newAddress')}
                        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Button */}
              <div className="bg-red-600 rounded-lg shadow-lg p-6 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Emergency Alert</h3>
                <p className="text-red-100 text-sm mb-4">
                  Tap to alert emergency services with your location and medical information
                </p>
                <Link to="/main-line">
                    <button className="w-full bg-white text-red-600 py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    EMERGENCY
                    </button>
                </Link>
              </div>

              {/* Additional Description */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
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
