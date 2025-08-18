# 🎓 CS Graduation Countdown 2025

A beautiful, interactive countdown application for Bahirdar University Computer Science Class of 2025. Celebrate your graduation journey with memories, chat, and an animated countdown timer.

## ✨ Features

### 🕐 Enhanced Countdown Timer
- **Real-time countdown** to graduation day (July 15, 2025)
- **Photo rotation** from database every 2 seconds with smooth animations
- **Progress bar** showing graduation progress
- **Beautiful animations** using Framer Motion
- **Responsive design** for all devices

### 📸 Memory Wall
- **Share memories** with photos and descriptions
- **Photo rotation** in countdown timer
- **Like and comment** on memories
- **Beautiful grid layout** with hover effects
- **Real-time updates** from database

### 💬 Interactive Chat System
- **Real-time messaging** with classmates
- **Typing indicators** and animations
- **User avatars** and online status
- **Beautiful UI** with gradient backgrounds
- **Responsive design** for mobile and desktop

### 🎨 Enhanced UI/UX
- **Smooth animations** throughout the application
- **Gradient backgrounds** and modern design
- **Responsive layout** for all screen sizes
- **Interactive elements** with hover effects
- **Professional color scheme** matching graduation theme

### 🔐 Authentication System
- **Secure login/signup** with NextAuth.js
- **User profiles** and session management
- **Protected routes** for authenticated users
- **Password hashing** with bcrypt

### 📱 Responsive Design
- **Mobile-first approach**
- **Touch-friendly interactions**
- **Optimized for all devices**
- **Progressive Web App features**

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd countdown
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `env.example` to `.env.local` and fill in your values:
   ```bash
   cp env.example .env.local
   ```

   Update `.env.local` with your actual credentials:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/countdown
   
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production
   
   # UploadThing Configuration (for image uploads)
   UPLOADTHING_SECRET=your_uploadthing_secret_here
   UPLOADTHING_APP_ID=your_uploadthing_app_id_here
   
   # Email Configuration (for notifications)
   EMAIL_SERVER_HOST=smtp.gmail.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=your-email@gmail.com
   EMAIL_SERVER_PASSWORD=your-app-password
   
   # Application Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_GRADUATION_DATE=2025-07-15T09:00:00
   ```

4. **Set up MongoDB**
   
   **Option A: Local MongoDB**
   ```bash
   # Install MongoDB locally
   # Start MongoDB service
   mongod
   ```
   
   **Option B: MongoDB Atlas**
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create new cluster
   - Get connection string and update `MONGODB_URI`

5. **Set up UploadThing (for image uploads)**
   - Sign up at [UploadThing](https://uploadthing.com/)
   - Create new project
   - Get API keys and update environment variables

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── countdown/         # Countdown page
│   ├── dashboard/         # User dashboard
│   ├── memories/          # Memory management
│   └── chat/              # Chat system
├── components/            # React components
│   ├── ui/                # UI components (shadcn/ui)
│   ├── countdown-timer.tsx    # Enhanced countdown with photo rotation
│   ├── memory-wall.tsx        # Memory display component
│   ├── chat-system.tsx        # Interactive chat system
│   ├── hero-animation.tsx     # Animated hero section
│   └── image-upload.tsx       # Enhanced image upload
├── lib/                   # Utility libraries
│   ├── auth.ts            # NextAuth configuration
│   ├── mongodb.ts         # Database connection
│   └── memory-service.ts  # Memory CRUD operations
├── models/                 # MongoDB schemas
└── types/                  # TypeScript type definitions
```

## 🎯 Key Components

### Countdown Timer (`src/components/countdown-timer.tsx`)
- **Real-time countdown** with days, hours, minutes, seconds
- **Photo rotation** from database every 2 seconds
- **Smooth animations** and transitions
- **Progress bar** showing graduation progress
- **Responsive design** for all screen sizes

### Memory Wall (`src/components/memory-wall.tsx`)
- **Grid layout** for memory display
- **Hover effects** and animations
- **Like and comment** functionality
- **Responsive design** with proper spacing

### Chat System (`src/components/chat-system.tsx`)
- **Real-time messaging** interface
- **User avatars** and typing indicators
- **Beautiful gradient** backgrounds
- **Mobile-responsive** design

### Hero Animation (`src/components/hero-animation.tsx`)
- **Floating elements** with smooth animations
- **Particle effects** and sparkles
- **Graduation cap** with orbiting elements
- **Wave effects** and corner decorations

## 🔧 Configuration

### MongoDB Setup
1. Install MongoDB locally or use Atlas
2. Create database named `countdown`
3. Update `MONGODB_URI` in environment variables

### NextAuth Configuration
1. Generate secure secret: `openssl rand -base64 32`
2. Update `NEXTAUTH_SECRET` in environment variables
3. Configure authentication providers in `src/lib/auth.ts`

### Image Upload
1. Sign up for UploadThing
2. Get API keys and update environment variables
3. Configure upload endpoints in `src/lib/uploadthing.ts`

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables for Production
- Update `NEXTAUTH_URL` to your production domain
- Use strong, unique `NEXTAUTH_SECRET`
- Configure production MongoDB connection
- Set up production image upload service

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🎨 Customization

### Colors and Themes
- Update CSS variables in `src/app/globals.css`
- Modify gradient colors in components
- Customize button styles and hover effects

### Graduation Date
- Update `NEXT_PUBLIC_GRADUATION_DATE` in environment
- Modify countdown logic in `CountdownTimer` component

### University Branding
- Replace "Bahirdar University" with your institution
- Update logos and branding elements
- Customize color scheme to match university colors

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Check if MongoDB is running
- Verify connection string in `.env.local`
- Ensure network access (for Atlas)

**Authentication Issues**
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Clear browser cookies and local storage

**Image Upload Failures**
- Verify UploadThing credentials
- Check file size limits
- Ensure proper file types

**Build Errors**
- Clear `.next` directory: `rm -rf .next`
- Update dependencies: `npm update`
- Check Node.js version compatibility

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** for the amazing React framework
- **Framer Motion** for smooth animations
- **Tailwind CSS** for beautiful styling
- **shadcn/ui** for excellent UI components
- **MongoDB** for database functionality
- **NextAuth.js** for authentication

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Made with ❤️ for the CS Class of 2025 at Bahirdar University**

*May your graduation be as amazing as this application! 🎓✨*