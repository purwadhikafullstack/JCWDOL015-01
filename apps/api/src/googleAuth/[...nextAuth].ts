import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authConfig: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      const { email, name } = user;

      try {
        const response = await fetch('http://localhost:8000/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name }),
        });

        const data = await response.json();

        if (data.status !== 'success') {
          throw new Error('Failed to authenticate user');
        }

        return true;
      } catch (error) {
        console.error('Error during sign-in:', error);
        return false;
      }
    },

    
  },
};

export default NextAuth(authConfig);
