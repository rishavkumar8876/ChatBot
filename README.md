# ApnaGPT - Full-Stack AI Assistant Platform 🚀

ApnaGPT has evolved from a basic UI clone into a fully functional, production-ready AI assistant platform driven by modern web technologies and the powerful Google Gemini AI model.

## Features & Enhancements Completed

### 🔐 User Authentication & Authorization
- Fully secure **JWT-based Authentication Middleware** protecting all API communications.
- Salted password hashing utilizing `bcryptjs`.
- Thread references strictly tied to individual user profiles, granting total privacy for each user session.
- Completely revitalized, glassmorphism-styled Login & Signup components.

### 🌓 Light & Dark Theme Support
- Global Theme Context pushing CSS variables instantly across the entire DOM without reloading.
- Theme preferences saved persistently to `localStorage`.
- Hand-crafted CSS enforcing crisp `#ffffff` contrasting against deep animated mesh-gradients in Dark Mode.

### 🎙️ Web Voice Interaction Feature
- Deep integration with the browser's native **Web Speech API** (`SpeechRecognition`).
- Intuitive user feedback mechanisms including a glowing, animated `@keyframes` pulsing microphone, alerting users exactly when their microphone is hot and dictating text.

### ⚙️ Dropdown Functionality
- Responsive User Settings Dropdown tied to a top-right profile icon.
- Interactive actions to instantaneously Toggle Themes or execute Token invalidation upon safe Logout.

### 🤖 Google Gemini AI API Integration
- Fluidly leverages `@google/generative-ai` parsing user prompts with extreme intelligence over the `gemini-2.5-flash` language model SDK.
- Messages snap onto screen feeling exactly like genuine LLM terminals via specialized Slide-and-Fade CSS animations.

### 🚀 Scalability & Deployment Prep
- Structured completely on a seamless **MERN Stack** (MongoDB, Express, React, Node.js).
- Proxy configurations established in Vite for dynamic frontend routing.
- The Express backend dynamically serves the compacted compiled application logic statically through `frontend/dist` making it ready to drop straight into AWS, Render, or Vercel production environments.

## Running the Project Locally

1. `cd frontend`
2. Run `npm run build` to compile the visual logic.
3. `cd ../backend`
4. Run `npm install` and ensure your `.env` contains:
   ```env
   GEMINI_API_KEY=your_google_api_key
   MONGODB_URI=your_mongo_string
   JWT_SECRET=strong_token_secret
   ```
5. Run `node server.js`
6. Open your browser directly to `http://localhost:3000` to dive into ApnaGPT!
