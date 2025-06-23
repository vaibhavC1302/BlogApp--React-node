📖 Lamadev Blog
A personal blogging platform for tech articles, built to showcase skills and enhance your portfolio.

✨ Features
✅ User Authentication – Powered by Clerk (Secure sign-up/login).
✅ Admin Controls – Users with admin rights can delete posts & comments.
✅ Blog Post Creation – Rich-text editor for writing articles.
✅ Comments & Likes – Engage with readers through discussions.
✅ Categories & Tags – Organize posts by topics.
✅ Image Uploads – Support for post thumbnails.

🛠️ Tech Stack
Frontend: React.js + Vite
Backend: Node.js + Express
Database: MongoDB (with Mongoose)
Authentication: Clerk (JWT-based)
Styling: CSS Modules 

🚀 Installation & Setup
Prerequisites
Node.js (v18+)
MongoDB Atlas 
Clerk Account

Backend (Server)
Create .env in the root/backend folder:
MONGO_URL = your mongo url
CLERK_WEBHOOK_SECRET = ""
CLERK_PUBLISHABLE_KEY=""
CLERK_SECRET_KEY=""
CLIENT_URL = ""
IK_URL_ENDPOINT = ""
IK_PUBLIC_KEY = ""
IK_PRIVATE_KEY = ""

Frontend (Client)
Create .env in the root/client folder:
VITE_IK_URL_ENDPOINT = ""
VITE_IK_PUBLIC_KEY =""
VITE_CLERK_PUBLISHABLE_KEY=""
VITE_API_URL = ""

