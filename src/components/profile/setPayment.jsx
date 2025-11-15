import React, { useState } from 'react';
import axios from 'axios';

export default function Setpaymetsetup() {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    otp: '',
    upiId: '',
    bankAccountName: '',
    bankAccountNumber: '',
    bankIfsc: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  // Get JWT token from localStorage or your auth state
  const getAuthToken = () => {
    return localStorage.getItem('access_token'); // Adjust based on your auth implementation
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Step 1: Send OTP to Email
  const handleSendOTP = async () => {
    if (!formData.email) {
      setMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {

      const response = await axios.post('http://127.0.0.1:8006/SendEmailOTPAPIView/',{"email": formData.email },{
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMessage({ type: 'success', text: response.data.message || 'OTP sent to your email' });
      setIsEmailSent(true);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to send OTP. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      setMessage({ type: 'error', text: 'Please enter the OTP' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post('http://127.0.0.1:8006/VerifyEmailOTPAPIView/',{"otp": formData.otp },{
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMessage({ type: 'success', text: response.data.message || 'Email verified successfully' });
      setIsOtpVerified(true);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Invalid OTP. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Update Bank Details
  const handleSubmit = async () => {
    if (!isOtpVerified) {
      setMessage({ type: 'error', text: 'Please verify your email first' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    const bankDetails = {
      upi_id: formData.upiId,
      bank_account_name: formData.bankAccountName,
      bank_account_number: formData.bankAccountNumber,
      bank_ifsc: formData.bankIfsc
    };

    try {
      const response = await axios.put('http://127.0.0.1:8006/UpdateBankDetailsAPIView/',bankDetails,{
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMessage({ type: 'success', text: response.data.message || 'Bank details updated successfully' });
      
      // Optional: Reset form after successful submission
      setTimeout(() => {
        setFormData({
          userName: '',
          email: '',
          otp: '',
          upiId: '',
          bankAccountName: '',
          bankAccountNumber: '',
          bankIfsc: ''
        });
        setIsEmailSent(false);
        setIsOtpVerified(false);
      }, 2000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to update bank details. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        <main className="flex flex-1 justify-between py-10 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-full">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-gray-900 mb-2">Manage Payment Method</h1>
              <p className="text-base text-gray-500">Add or edit payment details for a user.</p>
            </div>

            {/* Message Display */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <div>
                {/* Required Information */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 pb-1">Required Information</h3>
                  <hr className="border-gray-200 mb-6"/>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div className="sm:col-span-1">
                      <label className="flex flex-col">
                        <p className="text-sm font-medium text-gray-700 pb-2">User Name</p>
                        <input
                          name="userName"
                          value={formData.userName}
                          onChange={handleChange}
                          disabled={isOtpVerified}
                          className="flex w-full rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 bg-gray-50 h-12 px-4 text-base disabled:opacity-50"
                          placeholder="Enter user's full name"
                          type="text"
                        />
                      </label>
                    </div>
                    
                    <div className="sm:col-span-1">
                      <label className="flex flex-col">
                        <p className="text-sm font-medium text-gray-700 pb-2">Email</p>
                        <div className="flex gap-2">
                          <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isEmailSent}
                            className="flex w-full rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 bg-gray-50 h-12 px-4 text-base disabled:opacity-50"
                            placeholder="Enter user's email address"
                            type="email"
                          />
                          {!isEmailSent && (
                            <button
                              onClick={handleSendOTP}
                              disabled={loading}
                              className="whitespace-nowrap px-4 h-12 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                          )}
                        </div>
                      </label>
                    </div>
                    
                    <div className="sm:col-span-1">
                      <label className="flex flex-col">
                        <p className="text-sm font-medium text-gray-700 pb-2">OTP</p>
                        <div className="flex gap-2">
                          <input
                            name="otp"
                            value={formData.otp}
                            onChange={handleChange}
                            disabled={!isEmailSent || isOtpVerified}
                            className="flex w-full rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 bg-gray-50 h-12 px-4 text-base disabled:opacity-50"
                            maxLength="6"
                            placeholder="6-digit code"
                            type="text"
                          />
                          {isEmailSent && !isOtpVerified && (
                            <button
                              onClick={handleVerifyOTP}
                              disabled={loading}
                              className="whitespace-nowrap px-4 h-12 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {loading ? 'Verifying...' : 'Verify'}
                            </button>
                          )}
                          {isOtpVerified && (
                            <div className="flex items-center px-4 h-12 bg-green-50 border border-green-200 rounded-lg">
                              <span className="text-green-600 text-sm font-medium">✓ Verified</span>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Optional Information - Only show after OTP verification */}
                {isOtpVerified && (
                  <div className="mt-10">
                    <h3 className="text-lg font-bold text-gray-900 pb-1">Payment Information</h3>
                    <hr className="border-gray-200 mb-6"/>
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <label className="flex flex-col">
                          <p className="text-sm font-medium text-gray-700 pb-2">UPI ID</p>
                          <input
                            name="upiId"
                            value={formData.upiId}
                            onChange={handleChange}
                            className="flex w-full rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 bg-gray-50 h-12 px-4 text-base"
                            placeholder="e.g., username@okhdfcbank"
                            type="text"
                          />
                        </label>
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label className="flex flex-col">
                          <p className="text-sm font-medium text-gray-700 pb-2">Bank Account Name</p>
                          <input
                            name="bankAccountName"
                            value={formData.bankAccountName}
                            onChange={handleChange}
                            className="flex w-full rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 bg-gray-50 h-12 px-4 text-base"
                            placeholder="Enter name as per bank records"
                            type="text"
                          />
                        </label>
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label className="flex flex-col">
                          <p className="text-sm font-medium text-gray-700 pb-2">Bank Account Number</p>
                          <input
                            name="bankAccountNumber"
                            value={formData.bankAccountNumber}
                            onChange={handleChange}
                            className="flex w-full rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 bg-gray-50 h-12 px-4 text-base"
                            placeholder="Enter account number"
                            type="text"
                          />
                        </label>
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label className="flex flex-col">
                          <p className="text-sm font-medium text-gray-700 pb-2">Bank IFSC</p>
                          <input
                            name="bankIfsc"
                            value={formData.bankIfsc}
                            onChange={handleChange}
                            className="flex w-full rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 bg-gray-50 h-12 px-4 text-base"
                            placeholder="Enter IFSC code"
                            type="text"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button - Only show after OTP verification */}
                {isOtpVerified && (
                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex items-center justify-center rounded-lg h-12 bg-blue-600 text-white text-base font-bold px-8 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}