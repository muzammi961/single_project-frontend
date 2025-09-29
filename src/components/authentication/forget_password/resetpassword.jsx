import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onChange = (e) => {
    const { id, value } = e.target;
    setForm((p) => ({
      ...p,
      [id === 'new-password' ? 'password' : 'confirm']: value
    }));
    setError('');
  };

  const onBack = () => {
    // Prefer history back; if no history, go to LoginPage
    if (window.history.length > 1) navigate(-1);
    else navigate('/LoginPage', { replace: true });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.password || !form.confirm) {
      setError('Please fill out both fields');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    // TODO: call reset password API
    console.log('Resetting password...');
  };

  return (
    <div className="min-h-screen relative font-display text-gray-200">
      {/* Deep base background */}
      <div className="absolute inset-0 bg-slate-950" />

      {/* Radial blue glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(900px 500px at 50% 0%, rgba(37,99,235,0.30), rgba(2,6,23,0) 65%)'
        }}
      />

      {/* Content */}
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

        <main className="flex-grow flex flex-col justify-center px-6">
          <form className="space-y-6 max-w-lg w-full mx-auto" onSubmit={onSubmit}>
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={form.password}
                onChange={onChange}
                className="form-input w-full rounded-lg border-slate-700 bg-slate-900/70 text-white h-12 px-4 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-500"
                autoComplete="new-password"
                aria-label="New password"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-slate-300 mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={form.confirm}
                onChange={onChange}
                className="form-input w-full rounded-lg border-slate-700 bg-slate-900/70 text-white h-12 px-4 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-500"
                autoComplete="new-password"
                aria-label="Confirm password"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-rose-400 font-medium -mt-2" role="alert">
                {error}
              </p>
            )}

            <div className="mt-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-950 shadow-[0_10px_30px_-10px_rgba(37,99,235,0.6)]"
              >
                Reset Password
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default ResetPassword;
