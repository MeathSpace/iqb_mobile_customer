🚀 Running the Project

To start the project in development mode:
npx expo start

📦 Building the Project

Android (Production Build)
eas build --platform android --profile production

iOS (Production Build)
eas build --platform ios --profile production

📁 Project Structure

The project is organized into the following main folders:

🔐 (auths) Folder

Contains all authentication-related screens:

Sign In

Sign Up

Forgot Password

Personal Info

Verification

🔒 (protected) Folder

Contains screens accessible only after user authentication.

This folder includes two types of screens:

Tab Screens

Located inside the tab folder

Accessible via bottom tab navigation

Other App Screens

Not part of the tab navigation

Still accessible after login

🧠 Context Folder

Manages application state using React Context:

AuthContext.jsx – Handles authentication-related state and logic

GlobalContext.jsx – Manages global application state

🧩 Components Folder

Contains all reusable components used throughout the application.




