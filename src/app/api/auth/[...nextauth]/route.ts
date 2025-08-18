import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectToDatabase } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import { User } from '@/models/user'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {}
        if (!email || !password) {
          console.log('Missing credentials')
          return null
        }

        try {
          await connectToDatabase()

          const user = await User.findOne({ email })
          if (!user) {
            console.log('No user found with email:', email)
            return null
          }

          // Compare password
          const isValid = await bcrypt.compare(password, user.password)
          if (!isValid) {
            console.log('Invalid password for user:', email)
            return null
          }

          console.log('User authenticated successfully:', email)

          // Return user object
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
          }
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
  jwt: {},
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/signup',
  },
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async jwt({ token, user, account }) {
      if (user && user.id) {
        console.log('JWT callback - user:', user.id)
        token.id = user.id
      } else {
        console.log('JWT callback - no user or user.id:', { hasUser: !!user, userId: user?.id })
      }
      if (account && account.access_token) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      console.log('Session callback - token:', token)
      if (session.user && token && token.id && typeof token.id === 'string') {
        session.user.id = token.id
        console.log('Session callback - user ID set:', session.user.id)
      } else {
        console.log('Session callback - missing required data:', { 
          hasUser: !!session.user, 
          hasToken: !!token, 
          hasTokenId: !!(token && token.id),
          tokenIdType: token && token.id ? typeof token.id : 'undefined'
        })
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
