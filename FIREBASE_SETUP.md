# Firebase Setup Guide for Rent My Place

## Quick Fix for "auth/configuration-not-found" Error

This error means your Firebase configuration is invalid. Follow these steps:

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: "rent-my-place" (or any name)
4. Follow the setup wizard (you can disable Google Analytics)

## Step 2: Enable Authentication

1. In Firebase Console, click "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Click "Email/Password"
5. Enable the first option "Email/Password"
6. Click "Save"

## Step 3: Get Your Configuration

1. In Firebase Console, click the gear icon ⚙️ → "Project settings"
2. Scroll down to "Your apps" section
3. Click "Add app" → Choose "Web" (</> icon)
4. Register app with nickname "Rent My Place Web"
5. Copy the configuration object that appears

It will look like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Step 4: Update Your .env File

Replace the test values in your `.env` file with the real values from Firebase:

```env
VITE_FIREBASE_API_KEY=AIzaSyD_YourRealApiKeyHere
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

⚠️ **Important**: 
- Copy the exact values from Firebase (no quotes)
- Make sure there are no spaces around the = sign
- The API key should start with "AIza"

## Step 5: Create Firestore Database

1. In Firebase Console, click "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" for now
4. Select your preferred location
5. Click "Enable"

## Step 6: Restart Your Dev Server

```bash
# Stop the server with Ctrl+C, then:
npm run dev
```

## Troubleshooting

If you still get errors:

1. **Check the browser console** (F12) for more details
2. **Verify your .env file** has the correct values
3. **Make sure the .env file** is in the root directory (same level as package.json)
4. **Clear your browser cache** and try again
5. **Check Firebase Console** to ensure Email/Password auth is enabled

## Test Credentials

Once set up, you can test with:
- Email: test@example.com
- Password: test123

## Security Note

Never commit your `.env` file to Git. The `.gitignore` file already excludes it.