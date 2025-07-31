# Google OAuth Setup Guide

## 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google OAuth2 API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure the OAuth consent screen
6. Create OAuth 2.0 Client ID

## 2. Configure OAuth Client

### Authorized JavaScript origins:
```
http://localhost:3000
https://yourdomain.com
```

### Authorized redirect URIs:
```
http://localhost:3000/google-callback
https://yourdomain.com/google-callback
```

## 3. Environment Variables

Create a `.env.local` file in your project root:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://dev-api.posport.io/api/v1
```

## 4. Update Google Client ID

Replace `YOUR_GOOGLE_CLIENT_ID` in `lib/Api/auth/googleAuth.ts` with your actual Google Client ID.

## 5. How It Works

1. User clicks "Continue with Google"
2. Redirects to Google OAuth consent screen
3. User authorizes the application
4. Google redirects back to `/google-callback` with authorization code
5. Frontend exchanges code for tokens via `/api/auth/google/token`
6. Backend exchanges code with Google for access token
7. Backend gets user info from Google
8. Returns application tokens and user data
9. User is logged in and redirected to dashboard

## 6. Security Notes

- Never expose `GOOGLE_CLIENT_SECRET` in frontend code
- Always validate tokens on the backend
- Use HTTPS in production
- Implement proper session management 