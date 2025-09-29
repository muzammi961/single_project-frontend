import React, { useReducer, } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import GoogleLoginButton from './googlelogin';
import axios from 'axios';


const initialState = {
  email: '',
  password: '',
  remember: false,
  errors: {},
  submitting: false
};

function reducer(state, action) {
  switch (action.type) {
    case 'set':
      return { ...state, [action.name]: action.value, errors: { ...state.errors, [action.name]: '' } };
    case 'toggle':
      return { ...state, remember: !state.remember };
    case 'errors':
      return { ...state, errors: action.payload || {} };
    case 'submitting':
      return { ...state, submitting: action.value };
    default:
      return state;
  }
}

export default function LoginPage({ dark = true }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { email, password, remember, errors, submitting } = state;
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const navigate=useNavigate()
  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email or username is required';
    if (!password) e.password = 'Password is required';
    return e;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const eObj = validate();
    if (Object.keys(eObj).length) {
      dispatch({ type: 'errors', payload: eObj });
      return;
    }

    try {
      dispatch({ type: 'submitting', value: true });
      const payload = { email, password };
      const res = await axios.post(
        `${baseURL}/authentication/LoginPageApiView/`,
        payload,
        {
          headers: { 'Content-Type': 'application/json' },

        }
      );
       localStorage.setItem('access_token', res.data.access);
       localStorage.setItem('refresh_token', res.data.refresh);
       if(res){
        navigate('/HomeSide')
       }
    } catch (err) {
      if (err.response) {
        const body = err.response.data || {};
        // DRF often returns non_field_errors or detail
        const msg =
          body.detail ||
          (Array.isArray(body.non_field_errors) && body.non_field_errors[0]) ||
          body.message ||
          'Bad request';
        // If field errors present, surface first one
        const firstField = Object.keys(body).find((k) => k !== 'detail' && k !== 'non_field_errors' && k !== 'message');
        if (firstField) {
          dispatch({ type: 'errors', payload: { [firstField]: Array.isArray(body[firstField]) ? body[firstField][0] : String(body[firstField]) } });
        } else {
          dispatch({ type: 'errors', payload: { submit: msg } });
        }
        console.log('Login 400:', err.response.status, body);
      } else if (err.request) {
        dispatch({ type: 'errors', payload: { submit: 'No response from server' } });
      } else {
        dispatch({ type: 'errors', payload: { submit: err.message || 'Request error' } });
      }
    } finally {
      dispatch({ type: 'submitting', value: false });
    }
  };

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="relative min-h-screen flex flex-col justify-between bg-gray-100 dark:bg-slate-950 transition-colors duration-500">
        <div className="pointer-events-none absolute inset-0 -z-10 animate-gradient-bg bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-pink-500/20 dark:from-blue-700/15 dark:via-purple-700/10 dark:to-pink-700/15" />
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: 'radial-gradient(900px 420px at 50% 140px, rgba(37,99,235,0.25), rgba(2,6,23,0) 60%)' }}
        />

        <main className="relative z-10 flex-1 w-full px-4 py-10 sm:py-14 flex items-start sm:items-center justify-center">
          <div className="w-full max-w-md">
            <div className="overflow-hidden rounded-3xl border border-white/20 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl shadow-[0_30px_80px_-30px_rgba(37,99,235,0.45)] ring-1 ring-black/5 dark:ring-white/5 transition-all duration-300">
              <div className="p-6 sm:p-7">
                {errors.submit && (
                  <div className="mb-4 rounded-lg border border-rose-400/30 bg-rose-500/10 text-rose-300 px-3 py-2 text-sm">
                    {errors.submit}
                  </div>
                )}

                <form onSubmit={onSubmit} className="space-y-5 sm:space-y-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                      Username or Email
                    </label>
                    <input
                      id="email"
                      type="text"
                      placeholder="Enter your email or username"
                      value={email}
                      onChange={(e) => dispatch({ type: 'set', name: 'email', value: e.target.value })}
                      required
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/70 border ${
                        errors.email ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                      } text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-500`}
                    />
                    {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => dispatch({ type: 'set', name: 'password', value: e.target.value })}
                      required
                      className={`w-full px-4 py-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/70 border ${
                        errors.password ? 'border-rose-500 focus:ring-rose-500' : 'border-slate-200 dark:border-slate-700 focus:ring-blue-500'
                      } text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-500`}
                    />
                    {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password}</p>}
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={() => dispatch({ type: 'toggle' })}
                        className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                        Remember me
                      </span>
                    </label>
                    <Link to="/ForgotPassword" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                      Forgot Password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-4 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-100 shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70"
                  >
                    {submitting ? 'Signing in...' : 'Login'}
                  </button>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-300 dark:border-slate-700" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-white/80 dark:bg-slate-900/70 text-slate-500 dark:text-slate-400 font-medium">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-center">
                    <GoogleLoginButton />
                  </div>
                </div>

                <div className="text-center mt-6">
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                    Don’t have an account?
                    <Link to="/RegistrationForm" className="ml-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="relative z-10 p-4 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-slate-900/60 backdrop-blur">
          Smart Travel Planner © 2025
        </footer>

        <style>{`
          @keyframes gradient-bg {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-bg {
            background-size: 200% 200%;
            animation: gradient-bg 18s ease infinite;
          }
        `}</style>
      </div>
    </div>
  );
}
