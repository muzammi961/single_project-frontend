import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentMethodsDeleteSt = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [otp, setOtp] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const API_BASE_URL = 'http://127.0.0.1:8006';

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      
      const response = await axios.get(`${API_BASE_URL}/GetPaymentMethodDetail/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      setPaymentMethods(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching payment methods:', err);
      if (err.response?.status === 404) {
        setError('No payment methods found');
      } else {
        setError('Failed to load payment methods');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInit = (method) => {
    setSelectedMethod(method);
    setShowOtpModal(true);
    setOtp('');
    setError('');
    setSuccess('');
  };

  const sendOtp = async () => {
    try {
      setSendingOtp(true);
      setError('');
      const token = localStorage.getItem("access_token");
      
      await axios.post(
        `${API_BASE_URL}/DeletePaymentMethodDetailVerifyEmailOTP/${selectedMethod.id}/`, 
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      setSuccess('OTP sent to your email. Please check your inbox.');
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  const confirmDelete = async () => {
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    try {
      setOtpLoading(true);
      setError('');
      const token = localStorage.getItem("access_token");
      
      await axios.post(
        `${API_BASE_URL}/DeletePaymentMethodDetail/${selectedMethod.id}/`, 
        { otp },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      // Remove the deleted item from state
      setPaymentMethods(prev => prev.filter(method => method.id !== selectedMethod.id));
      setSuccess('Payment method deleted successfully');
      setShowOtpModal(false);
      setSelectedMethod(null);
      setOtp('');
    } catch (err) {
      console.error('Error deleting payment method:', err);
      if (err.response?.data?.error === "Invalid OTP") {
        setError('Invalid OTP. Please try again.');
      } else if (err.response?.data?.error === "OTP is required") {
        setError('OTP is required');
      } else {
        setError('Failed to delete payment method');
      }
    } finally {
      setOtpLoading(false);
    }
  };

  const closeModal = () => {
    setShowOtpModal(false);
    setSelectedMethod(null);
    setOtp('');
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading payment methods...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Methods
          </h1>
          <p className="text-gray-600">
            Manage your bank accounts and payment details
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Payment Methods List */}
        {paymentMethods.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              No payment methods found
            </div>
            <p className="text-gray-400">
              You haven't added any payment methods yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Bank Name and Account Number */}
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {method.bank_account_name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Account: ••••{method.bank_account_number?.slice(-4)}
                        </p>
                      </div>
                    </div>

                    {/* Account Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Account Holder</label>
                        <p className="text-gray-900">{method.tpuser_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900">{method.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Account Number</label>
                        <p className="text-gray-900 font-mono">{method.bank_account_number}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">IFSC Code</label>
                        <p className="text-gray-900 font-mono">{method.bank_ifsc}</p>
                      </div>
                      {method.upi_id && (
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-500">UPI ID</label>
                          <p className="text-gray-900">{method.upi_id}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <div className="ml-4">
                    <button
                      onClick={() => handleDeleteInit(method)}
                      className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Payment Method Count */}
        {paymentMethods.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            {paymentMethods.length} payment method(s) found
          </div>
        )}

        {/* OTP Verification Modal */}
        {showOtpModal && selectedMethod && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Verify Deletion
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  You are about to delete the following payment method:
                </p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-900">{selectedMethod.bank_account_name}</p>
                  <p className="text-sm text-gray-600">Account: ••••{selectedMethod.bank_account_number?.slice(-4)}</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 mb-3">
                  An OTP has been sent to your email: <span className="font-semibold">{selectedMethod.email}</span>
                </p>
                
                <div className="flex space-x-2 mb-3">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={sendOtp}
                    disabled={sendingOtp}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                      sendingOtp
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {sendingOtp ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-auto"></div>
                    ) : (
                      'Resend OTP'
                    )}
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={otpLoading || !otp.trim()}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors duration-200 ${
                    otpLoading || !otp.trim()
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {otpLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Verifying...
                    </div>
                  ) : (
                    'Confirm Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodsDeleteSt;