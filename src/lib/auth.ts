import { AuthOptions, Session } from 'next-auth'
import { JWT } from 'next-auth/jwt' // Import JWT from next-auth/jwt
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectToDatabase } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import { User } from '@/models/user'

export const authOptions: AuthOptions = {
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
          const isValid = await bcrypt.compare(password, user.password)
          if (!isValid) {
            console.log('Invalid password for user:', email)
            return null
          }
          console.log('User authenticated successfully:', email)
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
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
  jwt: {},
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/signup',
  },
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async jwt({ token, user, account }): Promise<JWT> {
      if (user && user.id) {
        console.log('JWT callback - user:', user.id)
        token.id = user.id
      } else {
        console.log('JWT callback - no user or user.id:', {
          hasUser: !!user,
          userId: user?.id,
        })
      }
      if (account && account.access_token) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }): Promise<Session> {
      console.log('Session callback - token:', token)
      if (session.user && token && token.id && typeof token.id === 'string') {
        session.user.id = token.id
        console.log('Session callback - user ID set:', session.user.id)
      } else {
        console.log('Session callback - missing required data:', {
          hasUser: !!session.user,
          hasToken: !!token,
          hasTokenId: !!(token && token.id),
          tokenIdType: token && token.id ? typeof token.id : 'undefined',
        })
      }
      return session
    },
  },
}
