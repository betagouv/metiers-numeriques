/* eslint-disable sort-keys-fix/sort-keys-fix */
import { prisma } from '@api/libs/prisma'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import bcryptjs from 'bcryptjs'
import cuid from 'cuid'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import LinkedInProvider from 'next-auth/providers/linkedin'
import * as R from 'ramda'

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: cuid(),
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: profile.email,
          password: cuid(), // TODO: encrypt it
        }
      },
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      async profile(profile, tokens) {
        const emailResponse = await fetch(
          'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
          { headers: { Authorization: `Bearer ${tokens.access_token}` } },
        )
        const emailData = await emailResponse.json()

        return {
          id: cuid(),
          firstName: profile.localizedFirstName,
          lastName: profile.localizedLastName,
          email: emailData?.elements?.[0]?.['handle~']?.emailAddress,
          password: cuid(), // TODO: encrypt it
        }
      },
    }),
    CredentialsProvider({
      async authorize(credentials) {
        const user = await prisma.user.findUnique({ where: { email: credentials?.email } })

        if (!user) {
          return null
        }

        const matchPassword = await bcryptjs.compare(credentials?.password, user.password)
        if (!matchPassword) {
          return null
        }

        return user
      },

      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: 'Email', placeholder: 'john@doe.com', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = R.pick(['id', 'role', 'firstName', 'lastName', 'email'])(user)
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = token.user
      }

      return session
    },
  },
})
