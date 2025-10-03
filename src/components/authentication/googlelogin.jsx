// GoogleLoginButton.jsx
import { useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function GoogleLoginButton() {
  const btnRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const waitForGoogle = () =>
      new Promise((resolve) => {
        if (window.google?.accounts?.id) return resolve();
        const check = setInterval(() => {
          if (window.google?.accounts?.id) {
            clearInterval(check);
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
        callback: handleCredentialResponse,
        // ux_mode: 'popup', // uncomment if redirect flow causes COOP/COEP warnings
      });

      if (btnRef.current) {
        window.google.accounts.id.renderButton(btnRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'pill',
          logo_alignment: 'left',
          width: 360,
        });
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      // Backend expects { token } per your view
      const res = await axios.post(
        'http://127.0.0.1:8001/authentication/api/auth/google/',
        { token: response.credential },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (res.data?.access && res.data?.refresh) {
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
      }
      navigate('/');
    } catch (err) {
      console.error('Error logging in:', err?.response ? err.response.data : err);
      // If you still see "Token used too early": sync OS time and retry
      // If you see "Wrong recipient": verify frontend client ID matches server audience
    }
  };

  return (
    <div
      ref={btnRef}
      className="flex justify-center select-none"
      aria-label="Sign in with Google"
    />
  );
}

export default GoogleLoginButton;
