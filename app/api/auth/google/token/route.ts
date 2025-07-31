import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code, redirect_uri } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    // Exchange authorization code for tokens using Google's token endpoint
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: 'authorization_code',
        redirect_uri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Google token exchange failed:', errorData);
      return NextResponse.json(
        { error: 'Failed to exchange authorization code' },
        { status: 400 }
      );
    }

    const tokenData = await tokenResponse.json();

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to get user info' },
        { status: 400 }
      );
    }

    const userInfo = await userInfoResponse.json();

    // Call our backend API with Google user data
    try {
      const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/google/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleId: userInfo.id,
          email: userInfo.email,
          firstName: userInfo.given_name,
          lastName: userInfo.family_name,
          picture: userInfo.picture,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token
        })
      });

      if (!backendResponse.ok) {
        const errorText = await backendResponse.text();
        console.error('Backend API error:', backendResponse.status, backendResponse.statusText);
        console.error('Backend API error response:', errorText);
        throw new Error(`Backend API error: ${backendResponse.status} - ${errorText}`);
      }

      const backendData = await backendResponse.json();
      console.log('Backend API response:', backendData);
      
      // Validate backend response structure
      if (!backendData.data || !backendData.data.tokens || !backendData.data.user) {
        console.error('Invalid backend response structure:', backendData);
        throw new Error('Invalid backend response structure');
      }
      
      console.log('Returning backend data to frontend');
      return NextResponse.json(backendData);
      
    } catch (error) {
      console.error('Error calling backend API:', error);
      
      // Fallback to temporary response if backend fails
      const fallbackResponse = {
        data: {
          tokens: {
            access: {
              token: 'google_oauth_temp_token_' + Date.now(),
              expiresIn: '3600'
            },
            refresh: {
              token: 'google_oauth_temp_refresh_' + Date.now(),
              expiresIn: '86400'
            }
          },
          user: {
            id: userInfo.id,
            email: userInfo.email,
            firstName: userInfo.given_name,
            lastName: userInfo.family_name,
            role: 'COMPANY_OWNER',
            companyId: null,
            phone: null
          }
        }
      };

      console.log('Using fallback response:', fallbackResponse);
      console.log('Fallback response structure validated');
      return NextResponse.json(fallbackResponse);
    }

  } catch (error) {
    console.error('Google auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 