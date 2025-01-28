import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';
import getEnv from './env';

// Extract environment variables.
const { REDIRECT_URI, CLIENT_ID, SCOPES, ALBUM_ID, SPOTIFY_API: { DISCOVERY } } = getEnv();

WebBrowser.maybeCompleteAuthSession(); // Ensure the browser closes after login.

const useSpotifyAuth = () => {
  const [token, setToken] = useState(null); // State to store the token.

  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: CLIENT_ID,
      scopes: SCOPES,
      
      usePKCE: false, 
      redirectUri: REDIRECT_URI,
    },
    DISCOVERY
  );

  // UseEffect to monitor the response and extract the access token.
  useEffect(() => {
    // Pretty print the entire response object.
    console.log('Authentication response:', JSON.stringify(response, null, 2));

    if (response?.type === 'success' && response.params?.access_token) {
      const { access_token } = response.params;  // Extract the token.
      console.log('Access token retrieved:', access_token);  // Log the token.
      setToken(access_token);  // Store the token in state.
    }
  }, [response]);  // Run whenever `response` changes.

  return { token, getSpotifyAuth: promptAsync };  // Return token and auth function.
};

export default useSpotifyAuth;
