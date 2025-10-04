import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GithubProvider from 'next-auth/providers/github';
import prisma from './db';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  // Temporarily disable adapter to test if database is the issue
  // adapter: PrismaAdapter(prisma) as any,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      // Remove custom authorization to use defaults
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Changed from user to token for JWT strategy
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to dashboard after sign-in
      if (url.includes('/api/auth/signin') || url.includes('/api/auth/callback')) {
        return `${baseUrl}/dashboard`;
      }
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    // Remove custom pages to use NextAuth defaults
  },
  session: {
    strategy: 'jwt', // Changed from 'database' to 'jwt' for testing
  },
  debug: true, // Enable debug mode to see what's happening
  secret: process.env.NEXTAUTH_SECRET,
};
