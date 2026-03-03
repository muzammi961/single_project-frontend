// import React, { useEffect, useMemo, useState } from 'react';
// import axios from 'axios';

// const API_ORIGIN = 'http://127.0.0.1:8001';

// const STEPS = {
//   REQUEST: 'REQUEST',
//   VERIFY: 'VERIFY',
//   RESET: 'RESET',
// };

// export default function ForgotPassword() {
//   const [step, setStep] = useState(STEPS.REQUEST);
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirm, setConfirm] = useState('');
//   const [error, setError] = useState('');
//   const [sending, setSending] = useState(false);
//   const [verifying, setVerifying] = useState(false);
//   const [resetting, setResetting] = useState(false);

//   // OTP window timer
//   const OTP_WINDOW_SEC = 120;
//   const [remaining, setRemaining] = useState(0);
//   const [otpIssuedAt, setOtpIssuedAt] = useState(null);
//   const [expired, setExpired] = useState(false);

// const mmss = useMemo(() => {
//   const total = Math.max(0, Math.floor(Number(remaining) || 0));
//   const mm = String(Math.floor(total / 60)).padStart(2, '0');
//   const ss = String(total % 60).padStart(2, '0');
//   return `${mm}:${ss}`;
// }, [remaining]);

//   useEffect(() => {
//     if (!otpIssuedAt) return;
//     const tick = () => {
//       const elapsed = Math.floor((Date.now() - otpIssuedAt) / 1000);
//       const left = Math.max(OTP_WINDOW_SEC - elapsed, 0);
//       setRemaining(left);
//       setExpired(left === 0);
//     };
//     tick();
//     const id = setInterval(tick, 1000);
//     return () => clearInterval(id);
//   }, [otpIssuedAt]);

//   const sendCode = async () => {
//     setError('');
//     if (!email) {
//       setError('Enter a valid email');
//       return;
//     }
//     try {
//       setSending(true);
//       await axios.post(`${API_ORIGIN}/authentication/password-reset-request/`, { email });
//       setOtp('');
//       setOtpIssuedAt(Date.now());
//       setExpired(false);
//       setStep(STEPS.VERIFY);
//     } catch (e) {
//       setError(parseAxiosError(e));
//     } finally {
//       setSending(false);
//     }
//   };

//   const verifyOtp = async (e) => {
//     e.preventDefault();
//     setError('');
//     if (expired) {
//       setError('OTP expired, resend.');
//       return;
//     }
//     if (!otp.trim()) {
//       setError('Enter the OTP code');
//       return;
//     }
//     try {
//       setVerifying(true);
//       await axios.post(`${API_ORIGIN}/authentication/otp-verify/`, { email, otp });
//       setStep(STEPS.RESET);
//     } catch (e) {
//       setError(parseAxiosError(e));
//     } finally {
//       setVerifying(false);
//     }
//   };

//   const resetPassword = async (e) => {
//     e.preventDefault();
//     setError('');
//     if (!password || !confirm) {
//       setError('Fill both password fields');
//       return;
//     }
//     if (password !== confirm) {
//       setError('Passwords do not match');
//       return;
//     }
//     try {
//       setResetting(true);
//       await axios.post(`${API_ORIGIN}/authentication/password-reset/`, {
//         email,
//         password,
//         confirm
//       });
//       // Done: show simple success and go back to first step
//       alert('Password reset successful');
//       setStep(STEPS.REQUEST);
//       setOtp('');
//       setPassword('');
//       setConfirm('');
//       setOtpIssuedAt(null);
//       setExpired(false);
//       setRemaining(0);
//     } catch (e) {
//       setError(parseAxiosError(e));
//     } finally {
//       setResetting(false);
//     }
//   };

//   const canSend = !sending && email.length > 3 && (!otpIssuedAt || expired || step === STEPS.REQUEST);
//   const canVerify = !verifying && !expired && otp.trim().length > 0;
//   const canReset = !resetting && password.length >= 6 && confirm.length >= 6;

//   return (
//     <div className="min-h-screen relative text-gray-200">
//       <div className="absolute inset-0 bg-slate-950" />
//       <div
//         className="absolute inset-0"
//         style={{
//           background:
//             'radial-gradient(900px 500px at 50% 0%, rgba(37,99,235,0.25), rgba(2,6,23,0) 65%)'
//         }}
//       />
//       <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
//         <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md p-6">
//           <h1 className="text-center text-2xl md:text-3xl font-semibold text-white">
//             {step === STEPS.REQUEST && 'Forgot your password?'}
//             {step === STEPS.VERIFY && 'Verify your email'}
//             {step === STEPS.RESET && 'Set a new password'}
//           </h1>
//           <p className="text-center text-slate-400 mt-2">
//             {step === STEPS.REQUEST && 'Enter the email to receive a verification code.'}
//             {step === STEPS.VERIFY && 'Enter the 6-digit code sent to your email.'}
//             {step === STEPS.RESET && 'Choose a strong password to secure the account.'}
//           </p>

//           {/* Error */}
//           {error && (
//             <div className="mt-4 p-3 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 text-sm">
//               {error}
//             </div>
//           )}

//           {/* Step: Request */}
//           {step === STEPS.REQUEST && (
//             <div className="mt-6 space-y-5">
//               <div className="relative">
//                 <input
//                   type="email"
//                   placeholder="Email address"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full h-12 px-4 rounded-lg bg-slate-800/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 text-white"
//                 />
//               </div>
//               <button
//                 onClick={sendCode}
//                 disabled={!canSend}
//                 className={`w-full h-12 rounded-lg text-white font-semibold shadow-[0_10px_30px_-10px_rgba(37,99,235,0.6)] ${
//                   canSend ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-700 cursor-not-allowed'
//                 }`}
//               >
//                 {sending ? 'Sending…' : 'Send Code'}
//               </button>
//             </div>
//           )}

//           {/* Step: Verify */}
//           {step === STEPS.VERIFY && (
//             <form onSubmit={verifyOtp} className="mt-6 space-y-5">
//               <div className="space-y-3">
//                 <div className="relative">
//                   <input
//                     type="email"
//                     value={email}
//                     readOnly
//                     className="w-full h-12 px-4 rounded-lg bg-slate-800/50 border border-slate-700 text-slate-300 cursor-not-allowed"
//                   />
//                 </div>
//                 <div className="relative">
//                   <input
//                     type="text"
//                     placeholder="6-digit OTP"
//                     inputMode="numeric"
//                     pattern="\d*"
//                     value={otp}
//                     onChange={(e) => setOtp(e.target.value)}
//                     className={`w-full h-12 px-4 rounded-lg bg-slate-800/70 border focus:outline-none placeholder-slate-500 text-white ${
//                       expired
//                         ? 'border-rose-500 focus:ring-2 focus:ring-rose-500'
//                         : 'border-slate-700 focus:ring-2 focus:ring-blue-500'
//                     }`}
//                   />
//                 </div>
//                 {otpIssuedAt && (
//                   <div className="flex items-center justify-center gap-2 text-xs -mt-1">
//                     {!expired ? (
//                       <>
//                         <span className="text-slate-400">Code expires in</span>
//                         <span className="font-semibold text-blue-400 tabular-nums">{mmss}</span>
//                       </>
//                     ) : (
//                       <span className="font-semibold text-rose-400">OTP expired. Resend.</span>
//                     )}
//                   </div>
//                 )}
//               </div>
//               <div className="flex gap-3">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setStep(STEPS.REQUEST);
//                     setOtp('');
//                     setOtpIssuedAt(null);
//                     setExpired(false);
//                     setRemaining(0);
//                   }}
//                   className="flex-1 h-12 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
//                 >
//                   Change Email
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={!canVerify}
//                   className={`flex-1 h-12 rounded-lg text-white font-semibold shadow-[0_10px_30px_-10px_rgba(37,99,235,0.6)] ${
//                     canVerify ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-700 cursor-not-allowed'
//                   }`}
//                 >
//                   {verifying ? 'Verifying…' : 'Verify'}
//                 </button>
//               </div>
//               <div className="text-center">
//                 <button
//                   type="button"
//                   onClick={async () => {
//                     if (sending) return;
//                     try {
//                       setSending(true);
//                       await axios.post(`${API_ORIGIN}/authentication/password-reset-request/`, { email });
//                       setOtp('');
//                       setOtpIssuedAt(Date.now());
//                       setExpired(false);
//                     } catch (e) {
//                       setError(parseAxiosError(e));
//                     } finally {
//                       setSending(false);
//                     }
//                   }}
//                   className="text-sm font-semibold text-blue-400 hover:text-blue-300"
//                 >
//                   Resend {otpIssuedAt && !expired ? `in ${mmss}` : ''}
//                 </button>
//               </div>
//             </form>
//           )}

//           {/* Step: Reset */}
//           {step === STEPS.RESET && (
//             <form onSubmit={resetPassword} className="mt-6 space-y-5">
//               <div className="space-y-3">
//                 <input
//                   type="password"
//                   placeholder="New password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full h-12 px-4 rounded-lg bg-slate-800/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 text-white"
//                 />
//                 <input
//                   type="password"
//                   placeholder="Confirm password"
//                   value={confirm}
//                   onChange={(e) => setConfirm(e.target.value)}
//                   className="w-full h-12 px-4 rounded-lg bg-slate-800/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 text-white"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 disabled={!canReset}
//                 className={`w-full h-12 rounded-lg text-white font-semibold shadow-[0_10px_30px_-10px_rgba(37,99,235,0.6)] ${
//                   canReset ? 'bg-blue-600 hover:bg-blue-500' : 'bg-slate-700 cursor-not-allowed'
//                 }`}
//               >
//                 {resetting ? 'Resetting…' : 'Reset Password'}
//               </button>
//               <p className="text-center text-xs text-slate-400 mt-2">
//                 Tip: Use at least 6 characters with a mix of letters and numbers.
//               </p>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function parseAxiosError(err) {
//   if (err?.response?.data) {
//     const d = err.response.data;
//     if (typeof d === 'string') return d;
//     try {
//       return JSON.stringify(d);
//     } catch {
//       return 'Request failed';
//     }
//   }
//   return 'Network error';
// }









import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const API_ORIGIN = 'http://127.0.0.1:8001';

const STEPS = {
  REQUEST: 'REQUEST',
  VERIFY: 'VERIFY',
  RESET: 'RESET',
  SUCCESS: 'SUCCESS',
};

const OTP_WINDOW_SEC = 120;

export default function ForgotPassword() {
  const [step, setStep] = useState(STEPS.REQUEST);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [new_password, setNewPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // OTP timer
  const [otpIssuedAt, setOtpIssuedAt] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [expired, setExpired] = useState(false);

  // Format timer display
  const mmss = useMemo(() => {
    const total = Math.max(0, Math.floor(Number(remaining) || 0));
    const mm = String(Math.floor(total / 60)).padStart(2, '0');
    const ss = String(total % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  }, [remaining]);

  // Timer effect
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

  // Resend cooldown effect
  useEffect(() => {
    if (resendCooldown <= 0) return;
    
    const interval = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Input validation
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long.');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one digit.');
    }
    
    if (!/[a-zA-Z]/.test(password)) {
      errors.push('Password must contain at least one letter.');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character.');
    }
    
    if (password.includes('.')) {
      errors.push('Password cannot contain the "." character.');
    }
    
    return errors;
  };

  const sendCode = async () => {
    setError('');
    setSuccess('');
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    try {
      setSending(true);
      const response = await axios.post(`${API_ORIGIN}/authentication/password-reset-request/`, { 
        email 
      });
      
      console.log('Send OTP response:', response.data);
      
      if (response.status === 200) {
        setOtp('');
        setOtpIssuedAt(Date.now());
        setExpired(false);
        setResendCooldown(30); // 30 second cooldown for resend
        setStep(STEPS.VERIFY);
        setSuccess('Verification code sent to your email');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (e) {
      const errorMessage = parseAxiosError(e);
      setError(errorMessage);
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (expired) {
      setError('OTP has expired. Please request a new code.');
      return;
    }
    
    const otpValue = otp.trim().replace(/\D/g, '');
    if (!otpValue || otpValue.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    try {
      setVerifying(true);
      console.log('Sending OTP verification:', { email, otp: otpValue });
      
      const response = await axios.post(`${API_ORIGIN}/authentication/otp-verify/`, { 
        email, 
        otp: parseInt(otpValue, 10) // Convert to integer as backend expects IntegerField
      });
      
      console.log('OTP verification response:', response.data);
      console.log('Response status:', response.status);
      
      if (response.status === 200 || response.status === 201) {
        setSuccess('OTP verified successfully!');
        // Immediately move to RESET step after successful verification
        setStep(STEPS.RESET);
        setTimeout(() => setSuccess(''), 2000);
      } else {
        setError('OTP verification failed. Please try again.');
      }
    } catch (e) {
      console.error('OTP verification error:', e);
      const errorMessage = parseAxiosError(e);
      setError(errorMessage);
    } finally {
      setVerifying(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!new_password || !confirm_password) {
      setError('Please fill in both password fields');
      return;
    }
    
    const passwordErrors = validatePassword(new_password);
    if (passwordErrors.length > 0) {
      setError(passwordErrors[0]);
      return;
    }
    
    if (new_password !== confirm_password) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setResetting(true);
      console.log('Resetting password:', { 
        email, 
        new_password, 
        confirm_password 
      });
      
      const response = await axios.post(`${API_ORIGIN}/authentication/password-reset/`, {
        email,
        new_password,
        confirm_password
      });
      
      console.log('Password reset response:', response.data);
      
      if (response.status === 200 || response.status === 201) {
        setSuccess('Password reset successfully!');
        setStep(STEPS.SUCCESS);
        
        // Reset form after delay
        setTimeout(() => {
          setStep(STEPS.REQUEST);
          setEmail('');
          setOtp('');
          setNewPassword('');
          setConfirmPassword('');
          setOtpIssuedAt(null);
          setExpired(false);
          setRemaining(0);
          setSuccess('');
        }, 3000);
      }
      
    } catch (e) {
      console.error('Password reset error:', e);
      const errorMessage = parseAxiosError(e);
      setError(errorMessage);
    } finally {
      setResetting(false);
    }
  };

  const handleResendCode = async () => {
    if (sending || resendCooldown > 0) return;
    
    setError('');
    try {
      setSending(true);
      await axios.post(`${API_ORIGIN}/authentication/password-reset-request/`, { email });
      setOtp('');
      setOtpIssuedAt(Date.now());
      setExpired(false);
      setResendCooldown(30);
      setSuccess('New verification code sent');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      const errorMessage = parseAxiosError(e);
      setError(errorMessage);
    } finally {
      setSending(false);
    }
  };

  const canSend = !sending && isValidEmail(email) && (!otpIssuedAt || expired || step === STEPS.REQUEST);
  const canVerify = !verifying && !expired && otp.trim().replace(/\D/g, '').length === 6;
  const canReset = !resetting && new_password && confirm_password && new_password === confirm_password;

  return (
    <div className="min-h-screen relative text-gray-200 bg-slate-950">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(900px 500px at 50% 0%, rgba(37,99,235,0.25), rgba(2,6,23,0) 65%)'
        }}
      />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-md p-6 md:p-8">
          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-sm flex items-center gap-2 animate-fadeIn">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span>{success}</span>
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 text-sm flex items-center gap-2 animate-fadeIn">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <h1 className="text-center text-2xl md:text-3xl font-semibold text-white">
            {step === STEPS.REQUEST && 'Forgot Password?'}
            {step === STEPS.VERIFY && 'Verify Email'}
            {step === STEPS.RESET && 'Set New Password'}
            {step === STEPS.SUCCESS && 'Success!'}
          </h1>
          
          <p className="text-center text-slate-400 mt-2">
            {step === STEPS.REQUEST && 'Enter your email to receive a verification code.'}
            {step === STEPS.VERIFY && 'Enter the 6-digit code sent to your email.'}
            {step === STEPS.RESET && 'Create a new password for your account.'}
            {step === STEPS.SUCCESS && 'Your password has been reset successfully.'}
          </p>

          {/* Step: Request */}
          {step === STEPS.REQUEST && (
            <div className="mt-6 space-y-5 animate-fadeIn">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="w-full h-12 px-4 rounded-lg bg-slate-800/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 text-white transition-colors"
                  autoComplete="email"
                  disabled={sending}
                />
              </div>
              <button
                onClick={sendCode}
                disabled={!canSend}
                className={`w-full h-12 rounded-lg text-white font-semibold transition-all duration-200 flex items-center justify-center ${
                  canSend 
                    ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.6)] active:scale-[0.98]' 
                    : 'bg-slate-700 cursor-not-allowed'
                }`}
              >
                {sending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    Send Code
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Step: Verify */}
          {step === STEPS.VERIFY && (
            <form onSubmit={verifyOtp} className="mt-6 space-y-5 animate-fadeIn">
              <div className="space-y-4">
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
                    placeholder="Enter 6-digit OTP"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength="6"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setOtp(value);
                      setError('');
                    }}
                    className={`w-full h-12 px-4 rounded-lg bg-slate-800/70 border focus:outline-none placeholder-slate-500 text-white text-center tracking-widest text-xl transition-colors ${
                      expired
                        ? 'border-rose-500 focus:ring-2 focus:ring-rose-500'
                        : 'border-slate-700 focus:ring-2 focus:ring-blue-500'
                    }`}
                    autoComplete="one-time-code"
                    disabled={verifying}
                    autoFocus
                  />
                </div>
                
                {otpIssuedAt && (
                  <div className="flex items-center justify-center gap-2 text-sm">
                    {!expired ? (
                      <>
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="text-slate-400">Code expires in</span>
                        <span className="font-semibold text-blue-400 tabular-nums">{mmss}</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span className="font-semibold text-rose-400">OTP expired. Please resend.</span>
                      </>
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
                  className="flex-1 h-12 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
                  disabled={verifying}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"></path>
                  </svg>
                  Change Email
                </button>
                <button
                  type="submit"
                  disabled={!canVerify}
                  className={`flex-1 h-12 rounded-lg text-white font-semibold transition-all duration-200 flex items-center justify-center active:scale-[0.98] ${
                    canVerify 
                      ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.6)]' 
                      : 'bg-slate-700 cursor-not-allowed'
                  }`}
                >
                  {verifying ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Verify
                    </span>
                  )}
                </button>
              </div>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={sending || resendCooldown > 0}
                  className={`text-sm font-semibold transition-colors flex items-center justify-center gap-2 mx-auto ${
                    sending || resendCooldown > 0
                      ? 'text-slate-500 cursor-not-allowed'
                      : 'text-blue-400 hover:text-blue-300'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  {sending ? 'Sending...' : 
                   resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 
                   'Resend Code'}
                </button>
              </div>
            </form>
          )}

          {/* Step: Reset */}
          {step === STEPS.RESET && (
            <form onSubmit={resetPassword} className="mt-6 space-y-5 animate-fadeIn">
              <div className="space-y-4">
                <div className="relative">
                  <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <span>{email}</span>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="New password (min. 6 characters)"
                    value={new_password}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError('');
                    }}
                    className="w-full h-12 px-4 rounded-lg bg-slate-800/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 text-white transition-colors"
                    autoComplete="new-password"
                    disabled={resetting}
                    autoFocus
                  />
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirm_password}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError('');
                    }}
                    className="w-full h-12 px-4 rounded-lg bg-slate-800/70 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500 text-white transition-colors"
                    autoComplete="new-password"
                    disabled={resetting}
                  />
                </div>
                
                {new_password && (
                  <div className="space-y-1 text-xs animate-fadeIn">
                    <div className={`flex items-center gap-2 ${new_password.length >= 6 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={new_password.length >= 6 ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path>
                      </svg>
                      At least 6 characters
                    </div>
                    <div className={`flex items-center gap-2 ${/\d/.test(new_password) ? 'text-emerald-400' : 'text-rose-400'}`}>
                      <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={/\d/.test(new_password) ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path>
                      </svg>
                      Contains at least one digit
                    </div>
                    <div className={`flex items-center gap-2 ${/[a-zA-Z]/.test(new_password) ? 'text-emerald-400' : 'text-rose-400'}`}>
                      <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={/[a-zA-Z]/.test(new_password) ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path>
                      </svg>
                      Contains at least one letter
                    </div>
                    <div className={`flex items-center gap-2 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/.test(new_password) ? 'text-emerald-400' : 'text-rose-400'}`}>
                      <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={/[!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]/.test(new_password) ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path>
                      </svg>
                      Contains at least one special character
                    </div>
                    <div className={`flex items-center gap-2 ${!new_password.includes('.') ? 'text-emerald-400' : 'text-rose-400'}`}>
                      <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={!new_password.includes('.') ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}></path>
                      </svg>
                      Does not contain "." character
                    </div>
                  </div>
                )}
                
                {confirm_password && new_password !== confirm_password && (
                  <div className="flex items-center gap-2 text-sm text-rose-400 animate-fadeIn">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Passwords do not match
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                disabled={!canReset}
                className={`w-full h-12 rounded-lg text-white font-semibold transition-all duration-200 flex items-center justify-center active:scale-[0.98] ${
                  canReset 
                    ? 'bg-blue-600 hover:bg-blue-500 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.6)]' 
                    : 'bg-slate-700 cursor-not-allowed'
                }`}
              >
                {resetting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                    </svg>
                    Reset Password
                  </span>
                )}
              </button>
            </form>
          )}

          {/* Step: Success */}
          {step === STEPS.SUCCESS && (
            <div className="mt-6 space-y-6 text-center animate-fadeIn">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center animate-scaleIn">
                  <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white">Password Reset Successful!</h3>
                <p className="text-slate-400 mt-2">
                  You can now log in with your new password
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/login'}
                  className="w-full h-12 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500 transition-colors shadow-[0_10px_30px_-10px_rgba(37,99,235,0.6)] flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                  </svg>
                  Go to Login
                </button>
                
                <button
                  onClick={() => {
                    setStep(STEPS.REQUEST);
                    setEmail('');
                    setOtp('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setOtpIssuedAt(null);
                    setExpired(false);
                    setRemaining(0);
                    setSuccess('');
                  }}
                  className="w-full h-12 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors active:scale-[0.98]"
                >
                  Reset Another Password
                </button>
              </div>
              
              <p className="text-sm text-slate-500 animate-pulse">
                Redirecting to login page in 3 seconds...
              </p>
            </div>
          )}

          {/* Back to Login */}
          {step !== STEPS.SUCCESS && step !== STEPS.RESET && (
            <div className="mt-6 pt-4 border-t border-slate-800 text-center animate-fadeIn">
              <button
                onClick={() => window.location.href = '/login'}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"></path>
                </svg>
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Tailwind animation classes */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

// Utility function to parse axios errors
function parseAxiosError(err) {
  console.log('Error details:', err);
  
  if (!err) return 'An unknown error occurred';
  
  if (axios.isAxiosError(err)) {
    if (err.response) {
      const data = err.response.data;
      console.log('Error response data:', data);
      
      if (typeof data === 'string') return data;
      if (data?.detail) return data.detail;
      if (data?.message) return data.message;
      if (data?.error) return data.error;
      
      if (typeof data === 'object') {
        try {
          // Handle field-specific errors
          if (Array.isArray(data)) {
            return data[0] || 'Validation error';
          }
          
          const errors = Object.values(data).flat();
          if (errors.length > 0) return errors[0];
          if (data.non_field_errors) return data.non_field_errors[0];
          
          // Handle specific field errors
          if (data.password) {
            if (Array.isArray(data.password)) return data.password[0];
            return data.password;
          }
          if (data.email) {
            if (Array.isArray(data.email)) return data.email[0];
            return data.email;
          }
          if (data.otp) {
            if (Array.isArray(data.otp)) return data.otp[0];
            return data.otp;
          }
          if (data.new_password) {
            if (Array.isArray(data.new_password)) return data.new_password[0];
            return data.new_password;
          }
          if (data.confirm_password) {
            if (Array.isArray(data.confirm_password)) return data.confirm_password[0];
            return data.confirm_password;
          }
        } catch {}
      }
      
      if (err.response.status === 400) return 'Invalid request. Please check your input.';
      if (err.response.status === 401) return 'Unauthorized. Please try again.';
      if (err.response.status === 404) return 'User not found.';
      if (err.response.status === 429) return 'Too many attempts. Please wait and try again.';
      if (err.response.status === 500) return 'Server error. Please try again later.';
      
      return `Request failed with status ${err.response.status}`;
    }
    if (err.request) {
      console.log('Error request:', err.request);
      return 'No response from server. Please check your connection.';
    }
  }
  
  console.log('Error message:', err.message);
  return err.message || 'An error occurred. Please try again.';
}