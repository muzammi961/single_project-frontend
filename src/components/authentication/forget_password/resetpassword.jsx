import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_ORIGIN = 'http://127.0.0.1:8001';

const STEPS = {
  REQUEST: 'REQUEST',
  VERIFY: 'VERIFY',
  RESET: 'RESET',
};

export default function ForgotPassword() {
  const [step, setStep] = useState(STEPS.REQUEST);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resetting, setResetting] = useState(false);

  // OTP window timer
  const OTP_WINDOW_SEC = 120;
  const [remaining, setRemaining] = useState(0);
  const [otpIssuedAt, setOtpIssuedAt] = useState(null);
  const [expired, setExpired] = useState(false);

const mmss = useMemo(() => {
  const total = Math.max(0, Math.floor(Number(remaining) || 0));
  const mm = String(Math.floor(total / 60)).padStart(2, '0');
  const ss = String(total % 60).padStart(2, '0');
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

  const sendCode = async () => {
    setError('');
    if (!email) {
      setError('Enter a valid email');
      return;
    }
    try {
      setSending(true);
      await axios.post(`${API_ORIGIN}/authentication/password-reset-request/`, { email });
      setOtp('');
      setOtpIssuedAt(Date.now());
      setExpired(false);
      setStep(STEPS.VERIFY);
    } catch (e) {
      setError(parseAxiosError(e));
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (expired) {
      setError('OTP expired, resend.');
      return;
    }
    if (!otp.trim()) {
      setError('Enter the OTP code');
      return;
    }
    try {
      setVerifying(true);
      await axios.post(`${API_ORIGIN}/authentication/otp-verify/`, { email, otp });
      setStep(STEPS.RESET);
    } catch (e) {
      setError(parseAxiosError(e));
    } finally {
      setVerifying(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (!password || !confirm) {
      setError('Fill both password fields');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    try {
      setResetting(true);
      await axios.post(`${API_ORIGIN}/authentication/password-reset/`, {
        email,
        password,
        confirm
      });
      // Done: show simple success and go back to first step
      alert('Password reset successful');
      setStep(STEPS.REQUEST);
      setOtp('');
      setPassword('');
      setConfirm('');
      setOtpIssuedAt(null);
      setExpired(false);
      setRemaining(0);
    } catch (e) {
      setError(parseAxiosError(e));
    } finally {
      setResetting(false);
    }
  };

  const canSend = !sending && email.length > 3 && (!otpIssuedAt || expired || step === STEPS.REQUEST);
  const canVerify = !verifying && !expired && otp.trim().length > 0;
  const canReset = !resetting && password.length >= 6 && confirm.length >= 6;

  return (
    <div className="min-h-screen relative text-gray-200">
      <div className="absolute inset-0 bg-slate-950" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(900px 500px at 50% 0%, rgba(37,99,235,0.25), rgba(2,6,23,0) 65%)'
        }}
      />
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md p-6">
          <h1 className="text-center text-2xl md:text-3xl font-semibold text-white">
            {step === STEPS.REQUEST && 'Forgot your password?'}
            {step === STEPS.VERIFY && 'Verify your email'}
            {step === STEPS.RESET && 'Set a new password'}
          </h1>
          <p className="text-center text-slate-400 mt-2">
            {step === STEPS.REQUEST && 'Enter the email to receive a verification code.'}
            {step === STEPS.VERIFY && 'Enter the 6-digit code sent to your email.'}
            {step === STEPS.RESET && 'Choose a strong password to secure the account.'}
          </p>

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 text-sm">
              {error}
            </div>
          )}

          {/* Step: Request */}
          {step === STEPS.REQUEST && (
            <div className="mt-6 space-y-5">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg bg-slate-800/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 text-white"
                />
              </div>
              <button
                onClick={sendCode}
                disabled={!canSend}
                className={`w-full h-12 rounded-lg text-white font-semibold shadow-[0_10px_30px_-10px_rgba(37,99,235,0.6)] ${
                  canSend ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-700 cursor-not-allowed'
                }`}
              >
                {sending ? 'Sending…' : 'Send Code'}
              </button>
            </div>
          )}

          {/* Step: Verify */}
          {step === STEPS.VERIFY && (
            <form onSubmit={verifyOtp} className="mt-6 space-y-5">
              <div className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    readOnly
                    className="w-full h-12 px-4 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 cursor-not-allowed"
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="6-digit OTP"
                    inputMode="numeric"
                    pattern="\d*"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={`w-full h-12 px-4 rounded-lg bg-slate-800/70 border focus:outline-none placeholder-slate-500 text-white ${
                      expired
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500'
                        : 'border-slate-700 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                </div>
                {otpIssuedAt && (
                  <div className="flex items-center justify-center gap-2 text-xs -mt-1">
                    {!expired ? (
                      <>
                        <span className="text-slate-400">Code expires in</span>
                        <span className="font-semibold text-blue-400 tabular-nums">{mmss}</span>
                      </>
                    ) : (
                      <span className="font-semibold text-rose-400">OTP expired. Resend.</span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep(STEPS.REQUEST);
                    setOtp('');
                    setOtpIssuedAt(null);
                    setExpired(false);
                    setRemaining(0);
                  }}
                  className="flex-1 h-12 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
                >
                  Change Email
                </button>
                <button
                  type="submit"
                  disabled={!canVerify}
                  className={`flex-1 h-12 rounded-lg text-white font-semibold shadow-[0_10px_30px_-10px_rgba(37,99,235,0.6)] ${
                    canVerify ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-700 cursor-not-allowed'
                  }`}
                >
                  {verifying ? 'Verifying…' : 'Verify'}
                </button>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  onClick={async () => {
                    if (sending) return;
                    try {
                      setSending(true);
                      await axios.post(`${API_ORIGIN}/authentication/password-reset-request/`, { email });
                      setOtp('');
                      setOtpIssuedAt(Date.now());
                      setExpired(false);
                    } catch (e) {
                      setError(parseAxiosError(e));
                    } finally {
                      setSending(false);
                    }
                  }}
                  className="text-sm font-semibold text-blue-400 hover:text-blue-300"
                >
                  Resend {otpIssuedAt && !expired ? `in ${mmss}` : ''}
                </button>
              </div>
            </form>
          )}

          {/* Step: Reset */}
          {step === STEPS.RESET && (
            <form onSubmit={resetPassword} className="mt-6 space-y-5">
              <div className="space-y-3">
                <input
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg bg-slate-800/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 text-white"
                />
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg bg-slate-800/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 text-white"
                />
              </div>
              <button
                type="submit"
                disabled={!canReset}
                className={`w-full h-12 rounded-lg text-white font-semibold shadow-[0_10px_30px_-10px_rgba(37,99,235,0.6)] ${
                  canReset ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-700 cursor-not-allowed'
                }`}
              >
                {resetting ? 'Resetting…' : 'Reset Password'}
              </button>
              <p className="text-center text-xs text-slate-400 mt-2">
                Tip: Use at least 6 characters with a mix of letters and numbers.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function parseAxiosError(err) {
  if (err?.response?.data) {
    const d = err.response.data;
    if (typeof d === 'string') return d;
    try {
      return JSON.stringify(d);
    } catch {
      return 'Request failed';
    }
  }
  return 'Network error';
}
