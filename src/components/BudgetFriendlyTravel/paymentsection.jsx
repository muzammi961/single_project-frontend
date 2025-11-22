import React, { useState, useEffect } from 'react';
import axios from 'axios';


const PaymentPage = () => {
  const [qrUrl, setQrUrl] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('qr');
  const [amount, setAmount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setQrUrl("http://127.0.0.1:8006/payment_qr/");
  }, []);

  const handleRazorpayPayment = async () => {
    setIsLoading(true);
    try {




      const res = await axios.post("http://127.0.0.1:8006/create-payment/",{ amount: amount });
    

      
      const options = {
        key: res.data.key,
        amount: res.data.amount,
        currency: res.data.currency,
        name: "Your Store Name",
        description: "Test Transaction",
        order_id: res.data.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(`http://127.0.0.1:8006/verify_payment/`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            
            if (verifyRes.data.status === "Payment Verified") {
              alert("Payment verified successfully!");
              console.log("Payment Verified");
            } else {
              alert("Payment verification failed!");
            }
          } catch (error) {
            console.error("Verification Error:", error);
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#000000"
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
      razorpay.on('payment.failed', function (response) {
        console.error("Payment Failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
      });
      
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment failed to initialize.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 text-white px-4 py-4 sm:py-6 text-center flex-shrink-0">
        <h1 className="text-xl sm:text-2xl font-bold">Complete Your Payment</h1>
        <p className="text-gray-300 text-xs sm:text-sm mt-1">Secure and fast payment processing</p>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Amount Display */}
        <div className="px-4 py-4 sm:py-6 border-b border-gray-200">
          <div className="text-center">
            <p className="text-gray-600 text-xs sm:text-sm">Total Amount</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">₹{amount}</p>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="px-4 py-4 sm:py-6 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Choose Payment Method</h3>
          
          <div className="grid grid-cols-2 gap-4 sm:gap-3">
            {/* QR Code Option */}
            <button
              onClick={() => setPaymentMethod('qr')}
              className={`p-3 sm:p-4 border-2 rounded-xl transition-all duration-200 ${
                paymentMethod === 'qr'
                  ? 'border-gray-800 bg-gray-50 ring-2 ring-gray-200'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-800 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700">QR Code</span>
              </div>
            </button>

            {/* Razorpay Option */}
            <button
              onClick={() => setPaymentMethod('razorpay')}
              className={`p-3 sm:p-4 border-2 rounded-xl transition-all duration-200 ${
                paymentMethod === 'razorpay'
                  ? 'border-gray-800 bg-gray-50 ring-2 ring-gray-200'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-800 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700">Online Pay</span>
              </div>
            </button>
          </div>
        </div>

        {/* Payment Content */}
        <div className="px-4 py-4 sm:py-6">
          {paymentMethod === 'qr' ? (
            // QR Code Payment Section
            <div className="text-center">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Scan QR Code to Pay</h3>
              
              {qrUrl && (
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-300 inline-block mb-3 sm:mb-4">
                  <img
                    src={qrUrl}
                    alt="Payment QR Code"
                    className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 mx-auto rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      console.error('Failed to load QR code image');
                    }}
                  />
                </div>
              )}

    

              <p className="text-xs text-gray-600 px-2">
                Scan the QR code with any UPI app like Google Pay, PhonePe, Paytm, etc.
              </p>
            </div>
          ) : (
            // Razorpay Payment Section
            <div className="text-center">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Secure Online Payment</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200">
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-300">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-800 text-xs sm:text-sm mb-2">
                  Your payment is secured with Razorpay
                </p>
                <p className="text-gray-700 text-xs">
                  256-bit SSL encryption | PCI DSS compliant
                </p>
              </div>

              <button
                onClick={handleRazorpayPayment}
                disabled={isLoading}
                className={`w-full py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-sm sm:text-base text-white transition-all duration-200 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gray-900 hover:bg-gray-800 shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  `Pay ₹${amount}`
                )}
              </button>

              <div className="mt-3 sm:mt-4 flex items-center justify-center space-x-2 text-xs text-gray-600">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs">Secure payment powered by Razorpay</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Fixed at bottom */}
      <div className="bg-gray-50 px-4 py-3 sm:py-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-center space-x-3 sm:space-x-6 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Secure</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Instant</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="hidden xs:inline">24/7 Support</span>
            <span className="xs:hidden">Support</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;