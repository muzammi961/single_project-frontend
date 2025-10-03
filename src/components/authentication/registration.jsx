import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const primary = '#3B82F6';
  const primaryRing = 'rgba(59, 130, 246, 0.5)';

  const googleBtnRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const waitForGoogle = () =>
      new Promise((resolve) => {
        if (window.google?.accounts?.id) return resolve();
        const timer = setInterval(() => {
          if (window.google?.accounts?.id) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });

    const init = async () => {
      await waitForGoogle();
      if (cancelled) return;
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        console.error('Missing VITE_GOOGLE_CLIENT_ID');
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredential
      });

      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'signup_with',
          shape: 'pill',
          logo_alignment: 'left',
          width: 360
        });
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  // Normalize any DRF-style error payload into { fieldErrs, nonField }
  const normalizeDrfErrors = (raw) => {
    const fieldErrs = {};
    let nonField = '';

    if (!raw) return { fieldErrs, nonField };

    // If backend wraps as {"status":"error","message":"...","errors":{...}}
    const data = raw.errors && typeof raw.errors === 'object' ? raw.errors : raw;

    // Common non-field containers
    if (typeof raw.detail === 'string') nonField = raw.detail;
    if (typeof raw.message === 'string' && !nonField) nonField = raw.message;
    if (Array.isArray(raw.non_field_errors) && raw.non_field_errors.length && !nonField) {
      nonField = String(raw.non_field_errors[0]);
    }

    Object.keys(data || {}).forEach((key) => {
      const val = data[key];
      if (Array.isArray(val) && val.length) {
        fieldErrs[key] = String(val[0]);
      } else if (typeof val === 'string') {
        fieldErrs[key] = val;
      } else if (val && typeof val === 'object') {
        const firstKey = Object.keys(val)[0];
        const nested = val[firstKey];
        fieldErrs[key] =
          Array.isArray(nested) && nested.length
            ? String(nested[0])
            : typeof nested === 'string'
            ? nested
            : 'Invalid value';
      }
    });

    return { fieldErrs, nonField };
  };

  const handleGoogleCredential = async (response) => {
    try {
      const res = await axios.post(
        `${baseURL}/authentication/api/auth/google/`,
        { token: response.credential },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (res.data?.access && res.data?.refresh) {
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
      }
      alert('Signed up with Google!');
      navigate('/LoginPage');
    } catch (err) {
      const { fieldErrs, nonField } = normalizeDrfErrors(err?.response?.data);
      setErrors(fieldErrs);
      setSubmitError(nonField || 'Google signup failed. Please try again.');
      console.error('Google signup failed:', err?.response ? err.response.data : err);
    }
  };

  // Client-side validation that mirrors backend
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    if (!email.endsWith('@gmail.com')) return 'Only @gmail.com addresses are allowed';
    return null;
  };

  const validatePassword = (password, confirm_password) => {
    const msgs = [];
    if (!password) msgs.push('Password is required');
    if (password && confirm_password && password !== confirm_password) {
      msgs.push('Password and confirm password do not match.');
    }
    if (password && password.length < 6) msgs.push('Password must be at least 6 characters long.');
    if (password && !/\d/.test(password)) msgs.push('Password must contain one digit ');
    if (password && !/[a-zA-Z]/.test(password)) msgs.push('Password must contain letter ');
    const specialCharacters = "!@#$%^&*()_+-=[]{}|;:,<>?\"'\\/~`.";
    if (password && ![...specialCharacters].some((c) => password.includes(c))) {
      msgs.push('Password must contain special character ');
    }
    if (password && password.includes('.')) {
      msgs.push("Password cannot contain the '.' character");
    }
    return msgs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (submitError) setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailError = validateEmail(formData.email);
      if (emailError) newErrors.email = emailError;
    }
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.confirm_password) newErrors.confirm_password = 'Please confirm your password';

    const pwMsgs = validatePassword(formData.password, formData.confirm_password);
    if (pwMsgs.length) {
      newErrors.password = pwMsgs[0];
      if (pwMsgs.some((m) => m.toLowerCase().includes('do not match')) && !newErrors.confirm_password) {
        newErrors.confirm_password = 'Password and confirm password do not match';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await axios.post(
        `${baseURL}/authentication/RegisterApiView/`,
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      // If backend returns structured success
      if (res?.data?.status === 'success') {
        navigate('/LoginPage');
      } else {
        // Fallback: still navigate on 201 with any payload
        navigate('/RegistrationForm');
      }

      setFormData({
        username: '',
        email: '',
        password: '',
        confirm_password: ''
      });
      setErrors({});
    } catch (error) {
      // When backend crashes (HTML), error.response.data is string; show generic banner
      if (typeof error?.response?.data === 'string') {
        setSubmitError('Registration failed due to a server error. Please try again.');
      } else {
        const { fieldErrs, nonField } = normalizeDrfErrors(error?.response?.data);
        setErrors((prev) => ({ ...prev, ...fieldErrs }));
        setSubmitError(nonField || 'Registration failed. Please try again.');
      }
      console.error('Registration failed:', error?.response?.data || error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClass = (fieldName) => {
    const base =
      'w-full pl-4 pr-4 py-3 bg-slate-800/60 border rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none transition-all duration-300';
    if (errors[fieldName]) return `${base} border-red-500 ring-2 ring-red-500`;
    return `${base} border-slate-700 focus:ring-2`;
  };

  return (
    <div className="min-h-screen font-sans relative">
      <div className="absolute inset-0 bg-slate-950" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(800px 400px at 50% 120px, rgba(59,130,246,0.25), rgba(2,6,23,0) 60%)'
        }}
      />
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-100">Create Your Account</h1>
            <p className="text-slate-400 mt-2">Join us on your next adventure!</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-xl shadow-[0_20px_80px_-20px_rgba(59,130,246,0.35)] ring-1 ring-slate-800">
            {submitError && (
              <div className="bg-red-500/10 text-red-400 border border-red-500/30 p-3 rounded-lg mb-4 text-sm text-center">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={getInputClass('username')}
             
                />
                {errors.username && (
                  <p className="text-red-400 text-xs mt-1 ml-1">{errors.username}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={getInputClass('email')}
                  
                />
                {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={getInputClass('password')}
                    autoComplete="new-password"
                 
                  />
                  {errors.password && (
                    <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirm_password"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    id="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className={getInputClass('confirm_password')}
                    autoComplete="new-password"
           
                  />
                  {errors.confirm_password && (
                    <p className="text-red-400 text-xs mt-1 ml-1">{errors.confirm_password}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform focus:outline-none"
                  style={{
                    backgroundColor: primary,
                    boxShadow: isSubmitting
                      ? 'none'
                      : '0 10px 30px -10px rgba(59,130,246,0.6)',
                    opacity: isSubmitting ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) e.currentTarget.style.backgroundColor = '#2563EB';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) e.currentTarget.style.backgroundColor = primary;
                  }}
                >
                  {isSubmitting ? 'Registering...' : 'Register'}
                </button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-slate-900/70 text-slate-400 font-medium">
                    Or sign up with
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <div ref={googleBtnRef} className="select-none" />
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-slate-400">
              Already have an account?{' '}
              <Link
                to="/LoginPage"
                className="font-medium hover:underline"
                style={{ color: primary, textDecorationColor: primary }}
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        input:focus {
          box-shadow: 0 0 0 4px ${primaryRing};
          border-color: ${primary};
        }
      `}</style>
    </div>
  );
};

export default RegistrationForm;
