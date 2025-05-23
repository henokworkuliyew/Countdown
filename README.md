Countdown Project

Welcome to the Countdown project! This is a web application built with Next.js, integrated with MongoDB for data storage, and utilizing UploadThing for file uploads. This README provides an overview, setup instructions, and usage details for the project.

Overview

The Countdown project is designed to allow users to create and share memories, featuring a form to input titles, descriptions, and images. It leverages modern web technologies to provide a seamless user experience with server-side rendering, database persistence, and file upload capabilities.





Frontend: Built with Next.js (version 15.3.2) for a reactive and optimized user interface.



Backend/Database: Uses MongoDB (via Mongoose, version 8.14.1) for storing memory data.



File Uploads: Powered by UploadThing (version 7.6.0) for secure and efficient image uploads.

Features





Create and store memories with titles, descriptions, and images.



Image upload functionality using UploadThing.



Responsive design with Tailwind CSS.



Authentication and session management (via NextAuth.js).



Real-time feedback with toast notifications.

Prerequisites





Node.js: Version 18.x or later.



npm: Version 9.x or later.



MongoDB: A running MongoDB instance (local or remote, e.g., MongoDB Atlas).



Git: For cloning the repository.

Installation





Clone the Repository

git clone https://github.com/henokworkuliyew/Countdown.git
cd countdown



Install Dependencies

npm install



Set Up Environment Variables





Create a .env.local file in the root directory.



Add the following variables (replace with your actual credentials):

MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id



Obtain the UPLOADTHING_SECRET and UPLOADTHING_APP_ID from your UploadThing dashboard.



Set Up MongoDB





Ensure your MongoDB instance is running.



Update the MONGODB_URI in .env.local with your connection string (e.g., mongodb://localhost:27017/countdown or a MongoDB Atlas URL).

Running the Project





Start the Development Server

npm run dev





Open http://localhost:3000 in your browser to view the app.



Build for Production

npm run build
npm run start





This builds the app and starts it in production mode.

Usage





Creating a Memory:





Navigate to /memories/create.



Fill in the title, description, and upload an image.



Click "Share Memory" to submit. A success toast will appear, and you’ll be redirected to the memory page.



Viewing Memories:





Memories are stored in MongoDB and can be retrieved via API routes (e.g., /api/memories).
