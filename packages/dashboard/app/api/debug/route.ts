import { NextResponse } from 'next/server';

export async function GET() {
  // Test GitHub OAuth URL construction
  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
  githubAuthUrl.searchParams.set('client_id', process.env.GITHUB_ID!);
  githubAuthUrl.searchParams.set('redirect_uri', `${process.env.NEXTAUTH_URL}/api/auth/callback/github`);
  githubAuthUrl.searchParams.set('scope', 'read:user user:email');
  githubAuthUrl.searchParams.set('state', 'test-state');

  return NextResponse.json({
    env: {
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT SET',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET (hidden)' : 'NOT SET',
      GITHUB_ID: process.env.GITHUB_ID ? `SET (${process.env.GITHUB_ID.substring(0, 5)}...)` : 'NOT SET',
      GITHUB_SECRET: process.env.GITHUB_SECRET ? 'SET (hidden)' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
    },
    githubAuthUrl: githubAuthUrl.toString(),
    expectedCallbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/github`,
    note: 'Check if the callback URL matches what you configured in GitHub App settings',
    instructions: [
      '1. Go to https://github.com/settings/apps',
      '2. Find your GreenLightCI app',
      '3. Under "Identifying and authorizing users", check:',
      '   - Callback URL matches expectedCallbackUrl above',
      '   - "Request user authorization (OAuth) during installation" is CHECKED',
      '4. Generate a NEW client secret if needed',
      '5. Make sure you saved the GitHub App (not just OAuth App)',
    ],
  });
}
