# ApnaGPT Architecture Guide

Absolutely! I can explain your entire project. Your application is built on the **MERN Stack** (MongoDB, Express, React, Node.js), integrating Google's Generative AI over a highly scalable decoupled architecture.

Below is a clear, file-by-file breakdown of what is happening inside your codebase.

---

## 1. The Backend (Node.js + Express)
*This is the brain of your application. It lives on Render and acts as a central communication hub between your React Frontend, your MongoDB Database, and Google's AI.*

### `server.js`
This is your entry point. It turns the server on, sets up CORS (so Vercel can talk to Render securely), connects to MongoDB, and registers your two main routing highways (`/api/auth` and `/api`).

### `models/` directory
This defines how your data is structured inside the MongoDB database using Mongoose.
- **`User.js`**: Defines the user table. It stores usernames and heavily encrypted passwords (hashed via `bcryptjs`).
- **`Thread.js`**: Defines the chat history table. It ties a specific array of chat messages to a specific `threadId` and a specific `userId`, meaning no user can ever see another user's chat history.

### `middleware/auth.js`
This is your "Bouncer". When a requested is made to your backend, this file violently intercepts it, rips open the HTTP Headers, and looks for a JWT (JSON Web Token). If the token is fake or expired, it instantly rejects the request with a `401 Unauthorized` error to secure your data.

### `routes/` directory
- **`auth.js`**: Handles `/api/auth/login` and `/register`. It hashes incoming passwords, validates them against the database, and issues JWT tokens.
- **`chat.js`**: Handles `/api/thread` and `/api/chat`. It uses the `auth.js` middleware to ensure only logged-in users enter. It handles fetching old chat histories, deleting threads, and pushing new messages. 

### `utils/gemini.js`
This is an isolated utility tool. Your `chat.js` route gives this file a simple string. This file packages the string up, securely attaches your `GEMINI_API_KEY`, and fires it across the internet to Google's supercomputers (`gemini-2.5-flash`), returning Google's hyper-intelligent Markdown response back to your server.

---

## 2. The Frontend (React + Vite)
*This is the face of your application. It is compiled by Vite and deployed globally on Vercel's Edge Network to serve high-speed UI graphics to your users.*

### `main.jsx` & `App.jsx`
- **`main.jsx`**: Bootstraps your React virtual DOM into the browser and wraps the entire program in `Context`.
- **`App.jsx`**: Acts as a Traffic Cop. It uses `react-router-dom` to check if a user is logged in. If they aren't, it blocks them from viewing `/chat` and forces them into `<Login />`. If they are, it dynamically applies the correct `data-theme` (Light/Dark mode) to the container.

### `MyContext.jsx`
This is your state-management powerhouse. Instead of passing variables infinitely downward through 100 components (called Prop Drilling), this file stores your `token`, `currThreadId`, `allThreads`, and active `theme` inside a global bubble that any component can instantly pluck information out of.

### `Auth Components (Login.jsx / Register.jsx)`
Beautifully styled using glassmorphism in `Auth.css`. They capture user keystrokes and fire a `POST` request using `import.meta.env.VITE_API_URL` to your backend. If the backend approves, it catches the `token`, slams it into the browser's `localStorage` and `MyContext`, and redirects the user into the chat room.

### `Sidebar.jsx`
This queries the backend for `allThreads` associated with your user ID. It uses CSS Flexbox to map them dynamically. Clicking a title fires an API request to download that thread's ancient messages, seamlessly overriding the active screen. Hovering allows you to execute an immediate `DELETE` request to obliterate a thread from MongoDB forever.

### `ChatWindow.jsx`
The absolute powerhouse of the frontend.
- **Microphone**: Injects the browser's native `SpeechRecognition` API. When dictating, it triggers a pulsing `@keyframes` CSS animation.
- **Live Markdown**: Maps complex strings received from your backend through `ReactMarkdown`, utilizing `rehypeHighlight` to physically colorize and structure raw code blocks exactly like ChatGPT.
- **Animations**: Wraps incoming user and GPT messages in `.userDiv` and `.gptDiv`, firing a smooth 0.3s `transform: translateY` CSS injection to gracefully slide messages up from the bottom of the screen.

---

## 3. The Decoupled Cloud Architecture
All of these interconnected puzzle pieces seamlessly execute cross-domain fetch requests natively out of `vercel.json` static routing endpoints mapped directly downwards into Render's backend pipelines.

### The Full Cycle (Send Message):
1. User clicks *Send* in `ChatWindow.jsx`.
2. React instantly writes the message to the screen locally.
3. React fires the text across the internet to Render via `VITE_API_URL`.
4. Render's `auth.js` middleware validates the JWT.
5. Render passes the text down to `chat.js`. 
6. `chat.js` flings the phrase to Google over `gemini.js`.
7. Google's supercomputer calculates the answer and passes the Markdown text back.
8. Render saves the massive conversation block into MongoDB via `Thread.js`.
9. Render fires a `200 OK` JSON response back to Vercel containing Google's text.
10. `ChatWindow.jsx` instantly triggers the UI slide animation and prints the response identically onto the user's glowing screen!
