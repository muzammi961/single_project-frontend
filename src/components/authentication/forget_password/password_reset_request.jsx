import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const navigate=useNavigate()
  const OTP_WINDOW_SEC = 120; 
  const [remaining, setRemaining] = useState(0);
  const [otpIssuedAt, setOtpIssuedAt] = useState(null); 
  const [expired, setExpired] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const mmss = useMemo(() => {
    const mm = String(Math.floor(remaining / 60)).padStart(2, '0');
    const ss = String(remaining % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  }, [remaining]);

  
  useEffect(() => {
    if (!otpIssuedAt) return;
    const tick = () => {
      const elapsed = Math.floor((Date.now() - otpIssuedAt) / 1000);
      const left = Math.max(OTP_WINDOW_SEC - elapsed, 0);
      setRemaining(left);
      setExpired(left === 0);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [otpIssuedAt]);

  const onSendCode = async () => {
    if (!email) return;
    try {
      setSending(true);
      await axios.post(`${baseURL}/authentication/password-reset-request/`,{"email":email})
      console.log('Send code to:', email);
      setOtp('');
      setOtpIssuedAt(Date.now());
      setExpired(false);
    } finally {
      setSending(false);
    }
  };
const onBack = () => {
    navigate('/LoginPage')
  };

  const onVerify = async (e) => {
    e.preventDefault();
      try {
    console.log(email)    
    if (expired) return;
      setVerifying(true);
       
      console.log('Verify OTP:', otp, 'for', email);
    } finally {
      setVerifying(false);
    }
  };

  const canSend = !sending && (!otpIssuedAt || expired); 
  const canVerify = !verifying && !expired && otp.trim().length > 0;

  return (
    <div className="min-h-screen font-[Plus_Jakarta_Sans] text-gray-200 relative">

      <div className="absolute inset-0 bg-slate-950" />

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(900px 500px at 50% 0%, rgba(37,99,235,0.30), rgba(2,6,23,0) 65%)'
        }}
      />

      {/* Page content */}
      <div className="relative z-10 flex flex-col h-screen">
        <header className="flex items-center p-4">
         <button
            type="button"
            onClick={onBack}
            className="text-white rounded-lg p-1 hover:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Go back"
            title="Back"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-white"></h1>
          <div className="w-10" />
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-2 -mt-16">
          <div className="w-full max-w-sm text-center">
            <div className="mb-8">
              <span
                className="material-symbols-outlined text-blue-400"
                style={{ fontSize: 60 }}
              >
                Reset Password
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">Forgot your password?</h2>
            <p className="text-slate-400 mb-8">
              Enter your email address to receive a verification code.
            </p>

            <form onSubmit={onVerify} className="space-y-6">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-4 pr-28 rounded-lg bg-slate-800/60 border-0 focus:ring-2 focus:ring-blue-500 placeholder-slate-400 text-white"
                  required
                />
                <button
                  type="button"
                  onClick={onSendCode}
                  disabled={!canSend}
                  className={`absolute inset-y-0 right-0 flex items-center justify-center px-4 text-sm font-bold rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    canSend
                      ? 'text-blue-400 hover:text-blue-300'
                      : 'text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {otpIssuedAt && !expired ? 'Code Sent' : sending ? 'Sending...' : 'Send Code'}
                </button>
              </div>

              {/* Countdown + status */}
              {otpIssuedAt && (
                <div className="flex items-center justify-center gap-2 -mt-2">
                  {!expired ? (
                    <>
                      <span className="text-xs text-slate-400">Code expires in</span>
                      <span className="text-xs font-bold text-blue-400 tabular-nums">{mmss}</span>
                    </>
                  ) : (
                    <span className="text-xs font-semibold text-rose-400">
                      OTP expired. Please resend.
                    </span>
                  )}
                </div>
              )}

              <div className="relative">
                <input
                  type="text"
                  placeholder="6-digit OTP"
                  inputMode="numeric"
                  pattern="\d*"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={`w-full h-14 pl-4 rounded-lg bg-slate-800/60 border-0 focus:ring-2 placeholder-slate-400 text-white ${
                    expired ? 'focus:ring-rose-500' : 'focus:ring-blue-500'
                  }`}
                  required
                  disabled={expired}
                />
              </div>

              <button
                type="submit"
                disabled={!canVerify}
                className={`w-full h-14 rounded-lg text-white font-bold text-base transition-colors shadow-[0_10px_30px_-10px_rgba(37,99,235,0.6)] ${
                  canVerify
                    ? 'bg-blue-600 hover:bg-blue-500'
                    : 'bg-slate-700 cursor-not-allowed'
                }`}
              >
                {verifying ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>

            <p className="mt-4 text-sm text-slate-400">
              Didn’t receive the code?{' '}
              <button
                type="button"
                onClick={onSendCode}
                disabled={!canSend}
                className={`font-bold hover:underline ${
                  canSend ? 'text-blue-400' : 'text-slate-500 cursor-not-allowed'
                }`}
                title={canSend ? 'Resend code' : 'Wait until the current code expires'}
              >
                Resend {otpIssuedAt && !expired ? `in ${mmss}` : ''}
              </button>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ForgotPassword;
