// GoogleLoginButton.jsx
import { useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function GoogleLoginButton() {
  const btnRef = useRef(null);
  const navigate=useNavigate()
  // Load when google is ready and render the button
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
      await waitForGoogle(); // GIS script loaded from index.html
      if (cancelled) return;

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      console.log('clind   ....',clientId)
      if (!clientId) {
        console.error('Missing VITE_GOOGLE_CLIENT_ID');
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse
      });

      // Render official Google button inside the div
      if (btnRef.current) {
        window.google.accounts.id.renderButton(btnRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'pill',
          logo_alignment: 'left',
          width: 360
        });
      }
      // Optionally show One Tap:
      // window.google.accounts.id.prompt();
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      const res = await axios.post(
        'http://127.0.0.1:8000/authentication/api/auth/google/',
        { token: response.credential },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (res.data?.access && res.data?.refresh) {
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
      }
      if(res){
      navigate('/')
      }else{
      navigate('/LoginPage')
      }
    } catch (err) {
      console.error(
        'Error logging in:',
        err?.response ? err.response.data : err
      );
    }
  };

  // Container for the official Google button
  return (
    <div
      ref={btnRef}
      className="flex justify-center select-none"
      aria-label="Sign in with Google"
    />
  );
}

export default GoogleLoginButton;
