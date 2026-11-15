# Vakati Pavan Kumar — Minimal Personal Portfolio

A simple, clean, and professional personal and educational portfolio website.

## 🚀 Key Features

1. **Design & Aesthetics**
   - Pure minimal, modern, and professional layout.
   - White background (`bg-white`) with high-contrast dark typography and subtle grey borders (`border-zinc-200`).
   - No photographs, avatars, or heavy illustrations.
   - Smooth navigation and fully mobile responsive.
   - No unnecessary animations or filler text.

2. **Strictly 7 Sections**
   - **1. Personal Details:** Name, title, and introduction bio.
   - **2. Education:** Schooling, Intermediate, and Engineering / College records.
   - **3. Technical Skills:** Categorized skill groups with clean tags.
   - **4. My Projects:** Authentic projects with title, description, tech stack, GitHub and live links.
   - **5. Achievements and Certifications:** Distinct sections for awards and credentials.
   - **6. Positions and Responsibilities:** Leadership and organizational roles.
   - **7. Contact Details:** Email, phone, location, and social links.

3. **Complete In-Browser Editing ("Edit Everything")**
   - **Admin Mode:** Secure login button in the top navigation and footer.
   - Every section contains **Edit**, **Add**, and **Delete** controls when logged in.
   - **Firebase Authentication:** Secure admin sign-in.
   - **Firebase Firestore:** Edits sync directly to cloud database.
   - **Offline / Instant Cache:** Edits are also mirrored to browser localStorage so your content remains permanent and survives page refreshes even before setting up Firebase.

---

## 🛠️ Tech Stack

- **React 18**
- **Tailwind CSS**
- **Firebase Authentication** & **Cloud Firestore**
- **Vite**
- **Vercel** (Ready for one-click deployment)

---

## 💻 Getting Started Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## 🔐 Admin Login & Firebase Setup

### Local Test Admin
When you launch the site before connecting your Firebase project:
- **Email:** `admin@portfolio.local`
- **Password:** `admin`

### Connecting Firebase Firestore & Auth
You can configure Firebase in two easy ways:

1. **Via the UI:** Log in as admin and click the Database icon (database settings) in the top navigation bar to enter your Firebase credentials.
2. **Via `.env`:** Copy `.env.example` to `.env` and fill in your Firebase Web App credentials:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
   ```

---

## ☁️ Deploying to Vercel

1. Push this repository to GitHub.
2. Import the repository in [Vercel](https://vercel.com).
3. If using Firebase, add your `VITE_FIREBASE_*` environment variables in Vercel Project Settings.
4. Deploy!
