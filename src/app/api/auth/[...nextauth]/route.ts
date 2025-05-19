import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import FacebookProvider from 'next-auth/providers/facebook'
import TwitterProvider from 'next-auth/providers/twitter'
// Adjust path
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
 // Adjust path
import bcrypt from 'bcrypt'
import { connectToDatabase } from '@/lib/mongodb'
import{ User} from '@/models/user'
async function getMongoClient() {
  const mongooseInstance = await connectToDatabase()
  return mongooseInstance.connection.getClient()
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(getMongoClient()), // Optional if using other providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { username, password } = credentials || {}
        if (!username || !password) {
          return null
        }

        try {
          // Connect to the database
          await connectToDatabase()

          // Find user by email
          const user = await User.findOne({ email: username })
          if (!user) {
            console.log('No user found with email:', username)
            return null
          }

          // Compare password
          const isValid = await bcrypt.compare(password, user.password)
          if (!isValid) {
            console.log('Invalid password for user:', username)
            return null
          }

          // Return user object
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
          }
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: '2.0',
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id
      }
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
