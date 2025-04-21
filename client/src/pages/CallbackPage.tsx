import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const CallbackPage: React.FC = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently, user } = useAuth0();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      if (isAuthenticated && user) {
        try {
          // Get the token from Auth0
          const token = await getAccessTokenSilently();
          
          // Call your backend to validate and get a session token
          const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            throw new Error('Failed to authenticate with the server');
          }
          
          const data = await response.json();
          
          // Login with the token from your backend
          loginWithToken(data.data.accessToken);
          
          // Redirect to the blog page
          navigate('/blog');
        } catch (error) {
          console.error('Error during callback processing:', error);
          navigate('/login');
        }
      } else if (!isLoading && !isAuthenticated) {
        navigate('/login');
      }
    };

    handleCallback();
  }, [isAuthenticated, isLoading, user, getAccessTokenSilently, loginWithToken, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-lg">Completing authentication...</p>
    </div>
  );
};

export default CallbackPage;
