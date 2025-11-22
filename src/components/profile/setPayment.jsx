import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function Setpaymetsetup() {
  const navigate=useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    userName: '',
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

  // Get JWT token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('access_token');
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

    if (!formData.userName) {
      setMessage({ type: 'error', text: 'Please enter your user name' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post(
        'http://127.0.0.1:8006/SendEmailOTPAPIView/',
        {
          email: formData.email,
          username: formData.userName
        },
        {
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
      const response = await axios.patch(
        'http://127.0.0.1:8006/VerifyEmailOTPAPIView/',
        { otp: formData.otp },
        {
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

    // Validate required bank fields
    if (!formData.bankAccountName || !formData.bankAccountNumber || !formData.bankIfsc) {
      setMessage({ type: 'error', text: 'Please fill all required bank details' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    const bankDetails = {
      upi_id: formData.upiId || "", // Optional field
      bank_account_name: formData.bankAccountName,
      bank_account_number: formData.bankAccountNumber,
      bank_ifsc: formData.bankIfsc
    };

    try {
      const response = await axios.patch(
        'http://127.0.0.1:8006/UpdateBankDetailsAPIView/',
        bankDetails,
        {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMessage({ type: 'success', text: response.data.message || 'Bank details updated successfully' });
      
      // Reset form after successful submission
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

  const resetForm = () => {
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
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        <main className="flex flex-1 justify-between py-10 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-full">
          <div className="flex justify-between items-center mb-8"><div>
    <h1 className="text-3xl font-black text-gray-900 mb-2">Setup Payment Method</h1>
    <p className="text-base text-gray-500"> Add your payment details for secure transactions.</p>
  </div>
  <button onClick={()=>navigate('/PaymentMethodsDeleteSt')} type="button"className="bg-black text-amber-50 border border-amber-50 px-4 py-2">Delete Payment Method</button>
</div>

     

            {/* Message Display */}
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">{message.text}</p>
                  <button 
                    onClick={() => setMessage({ type: '', text: '' })}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
              <div>
                {/* Email Verification Section */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 pb-1">Email Verification</h3>
                  <p className="text-sm text-gray-600 mb-6">Verify your email to secure your payment method</p>
                  <hr className="border-gray-200 mb-6"/>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <label className="flex flex-col">
                        <p className="text-sm font-medium text-gray-700 pb-2">User Name</p>
                        <input
                          name="userName"
                          value={formData.userName}
                          onChange={handleChange}
                          disabled={isEmailSent}
                          className="flex w-full rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 bg-gray-50 h-12 px-4 text-base disabled:opacity-50"
                          placeholder="Enter your full name"
                          type="text"
                        />
                      </label>
                    </div>
                    
                    <div className="sm:col-span-1">
                      <label className="flex flex-col">
                        <p className="text-sm font-medium text-gray-700 pb-2">Email Address</p>
                        <div className="flex gap-2">
                          <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isEmailSent}
                            className="flex w-full rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 bg-gray-50 h-12 px-4 text-base disabled:opacity-50"
                            placeholder="Enter your email address"
                            type="email"
                          />
                          {!isEmailSent && (
                            <button
                              onClick={handleSendOTP}
                              disabled={loading || !formData.userName || !formData.email}
                              className="whitespace-nowrap px-4 h-12 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {loading ? 'Sending...' : 'Send OTP'}
                            </button>
                          )}
                        </div>
                      </label>
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label className="flex flex-col">
                        <p className="text-sm font-medium text-gray-700 pb-2">Verification Code</p>
                        <div className="flex gap-2">
                          <input
                            name="otp"
                            value={formData.otp}
                            onChange={handleChange}
                            disabled={!isEmailSent || isOtpVerified}
                            className="flex w-full rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 bg-gray-50 h-12 px-4 text-base disabled:opacity-50"
                            maxLength="6"
                            placeholder="Enter 6-digit OTP sent to your email"
                            type="text"
                          />
                          {isEmailSent && !isOtpVerified && (
                            <button
                              onClick={handleVerifyOTP}
                              disabled={loading || !formData.otp}
                              className="whitespace-nowrap px-4 h-12 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                              {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                          )}
                          {isOtpVerified && (
                            <div className="flex items-center px-4 h-12 bg-green-50 border border-green-200 rounded-lg">
                              <span className="text-green-600 text-sm font-medium flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Email Verified
                              </span>
                            </div>
                          )}
                        </div>
                        {isEmailSent && !isOtpVerified && (
                          <p className="text-xs text-gray-500 mt-2">
                            Check your email for the verification code
                          </p>
                        )}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Payment Information - Only show after OTP verification */}
                {isOtpVerified && (
                  <div className="mt-10">
                    <h3 className="text-lg font-bold text-gray-900 pb-1">Bank Account Details</h3>
                    <p className="text-sm text-gray-600 mb-6">Add your bank account information for payments</p>
                    <hr className="border-gray-200 mb-6"/>
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="flex flex-col">
                          <p className="text-sm font-medium text-gray-700 pb-2">UPI ID (Optional)</p>
                          <input
                            name="upiId"
                            value={formData.upiId}
                            onChange={handleChange}
                            className="flex w-full rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 bg-gray-50 h-12 px-4 text-base"
                            placeholder="e.g., username@okhdfcbank"
                            type="text"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            Optional: Your UPI ID for faster payments
                          </p>
                        </label>
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label className="flex flex-col">
                          <p className="text-sm font-medium text-gray-700 pb-2">
                            Bank Account Name <span className="text-red-500">*</span>
                          </p>
                          <input
                            name="bankAccountName"
                            value={formData.bankAccountName}
                            onChange={handleChange}
                            className="flex w-full rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 bg-gray-50 h-12 px-4 text-base"
                            placeholder="Enter name as per bank records"
                            type="text"
                            required
                          />
                        </label>
                      </div>
                      
                      <div className="sm:col-span-1">
                        <label className="flex flex-col">
                          <p className="text-sm font-medium text-gray-700 pb-2">
                            Bank Account Number <span className="text-red-500">*</span>
                          </p>
                          <input
                            name="bankAccountNumber"
                            value={formData.bankAccountNumber}
                            onChange={handleChange}
                            className="flex w-full rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 bg-gray-50 h-12 px-4 text-base"
                            placeholder="Enter account number"
                            type="text"
                            required
                          />
                        </label>
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label className="flex flex-col">
                          <p className="text-sm font-medium text-gray-700 pb-2">
                            Bank IFSC Code <span className="text-red-500">*</span>
                          </p>
                          <input
                            name="bankIfsc"
                            value={formData.bankIfsc}
                            onChange={handleChange}
                            className="flex w-full rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 bg-gray-50 h-12 px-4 text-base"
                            placeholder="Enter IFSC code"
                            type="text"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            Find IFSC code on your cheque book or bank statement
                          </p>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 flex justify-between items-center">
                  <button
                    onClick={resetForm}
                    className="flex items-center justify-center rounded-lg h-12 border border-gray-300 text-gray-700 text-base font-medium px-6 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                  >
                    Reset Form
                  </button>
                  
                  {isOtpVerified && (
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !formData.bankAccountName || !formData.bankAccountNumber || !formData.bankIfsc}
                      className="flex items-center justify-center rounded-lg h-12 bg-blue-600 text-white text-base font-bold px-8 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        'Save Payment Method'
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Secure Payment Setup</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Your payment information is encrypted and secure. We use OTP verification to ensure only you can modify your payment methods.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}