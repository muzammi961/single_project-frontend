import React, { useState, useRef } from 'react';

const LinkPaymentMethod = () => {
  const [formData, setFormData] = useState({
    trip: 'Summer Getaway 2024',
    fullName: '',
    email: '',
    otp: ['', '', '', '', '', '']
  });
  const [showSuccess, setShowSuccess] = useState(false);
  
  const otpRefs = useRef([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData(prev => ({ ...prev, otp: newOtp }));

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    while (newOtp.length < 6) newOtp.push('');
    
    setFormData(prev => ({ ...prev, otp: newOtp }));
    
    const nextEmptyIndex = Math.min(pastedData.length, 5);
    otpRefs.current[nextEmptyIndex]?.focus();
  };

  const handleSubmit = () => {
    setShowSuccess(true);
    console.log('Form submitted:', formData);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col overflow-hidden">
      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-center min-h-full p-4 sm:p-6">
          <div className="w-full max-w-2xl">
            <div className="bg-white border border-gray-200 shadow-lg rounded-xl p-4 sm:p-6 md:p-8">
              
              {/* Success Message Banner */}
              {showSuccess && (
                <div className="flex items-center gap-3 bg-green-50 text-green-600 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs sm:text-sm font-medium">Payment method saved successfully!</p>
                </div>
              )}

              {/* Page Heading */}
              <div className="mb-6 sm:mb-8 text-center">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900">
                  Link Your Payment Method
                </h1>
                <p className="mt-2 text-sm sm:text-base text-gray-600">
                  Securely add your payment details for the trip.
                </p>
              </div>

              {/* Form */}
              <div className="space-y-4 sm:space-y-6">
                {/* Select Trip */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-900 mb-2">
                    Select Trip<span className="text-red-500">*</span>
                  </label>
                  <select
                    name="trip"
                    value={formData.trip}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 h-11 sm:h-12 px-3 text-sm sm:text-base transition-colors"
                  >
                    <option>Summer Getaway 2024</option>
                    <option>Winter Ski Trip</option>
                    <option>Asia Backpacking Adventure</option>
                  </select>
                </div>

                {/* User Full Name and Email */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
                  {/* User Full Name */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-900 mb-2">
                      User full name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 h-11 sm:h-12 px-3 text-sm sm:text-base transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-900 mb-2">
                      Email<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 h-11 sm:h-12 px-3 text-sm sm:text-base transition-colors"
                    />
                  </div>
                </div>

                {/* Payment Method (Read-only) */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-900 mb-2">
                    Payment Method
                  </label>
                  <div className="flex h-11 sm:h-12 w-full items-center rounded-lg border border-gray-300 bg-gray-100 px-3 text-sm sm:text-base text-gray-600 cursor-not-allowed">
                    Razorpay
                  </div>
                </div>

                {/* OTP Input */}
                <div className="flex flex-col items-center">
                  <label className="text-sm font-medium text-gray-900 mb-3">
                    Enter 6-Digit OTP<span className="text-red-500">*</span>
                  </label>
                  <div className="flex justify-center gap-2 sm:gap-3 w-full max-w-md">
                    {formData.otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={el => otpRefs.current[index] = el}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onPaste={index === 0 ? handleOtpPaste : undefined}
                        className="w-11 h-11 sm:w-14 sm:h-14 text-center text-lg sm:text-xl font-semibold rounded-lg border border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-colors"
                      />
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSubmit}
                  className="flex h-11 sm:h-12 w-full items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm sm:text-base font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-indigo-800"
                >
                  Save Payment Method
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkPaymentMethod;