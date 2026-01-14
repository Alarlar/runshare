# 🏃 RunShare Pro — Athlete Tracking & Social Mapping

**RunShare Pro** is a full-stack Progressive Web App (PWA) designed for me and friends to track our runs, walks, and cycling routes. It combines real-time GPS tracking with a social feed, allowing users to share their progress and visualize routes on an interactive map.

Live Demo: https://your-app-name.onrender.com

## Key Features

- **Dual-Mode Tracking**:
  - **Live GPS**: Real time route recording using the browser's Geolocation API.
  - **Manual Entry**: Interactive point to point route drawing directly on the map.
- **Secure Authentication**: User system using **JWT (JSON Web Tokens)** and password hashing with **BcryptJS**.
- **Interactive Mapping**: Powered by **Leaflet.js** with vector polylines and custom map markers.
- **Dynamic Social Feed**: A global activity log where users can view community routes; clicking an activity auto zooms the map to that specific path.
- **Personalized Stats**: Real time calculation of miles covered per session.
- **PWA Ready**: Mobile first design with `manifest.json` support, making it installable on iOS and Android devices.

## Tech Stack

### Frontend

- **JavaScript (ES6+)**: Modular logic without heavy framework.
- **Leaflet.js**: Industry standard library for interactive maps.
- **CSS3**: Advanced Flexbox/Grid layouts with a "Cyber Dark" aesthetic.
- **HTML5**: Semantic structure and Geolocation API.

### Backend

- **Node.js & Express.js**: Fast and scalable server side environment.
- **MongoDB & Mongoose**: NoSQL database for flexible activity and user data storage.
- **JWT**: Secure, stateless authentication middleware.

## Installation & Setup

1. **Clone the repository**:

   ```bash
   git clone [https://github.com/your-username/runshare-pro.git](https://github.com/your-username/runshare-pro.git)
   cd runshare-pro
   ```

### 2. Install Dependencies

This command reads your `package.json` and installs all necessary libraries (Express, Mongoose, JWT, etc.):

```bash
npm install
```

### 3. Configure Environment Variables

To keep your credentials secure, create a `.env` file in the root directory. This file is ignored by Git to protect your secrets.

```env
PORT=5008
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_LIFETIME=30d
```

4. Launch the Application

Start the development server with automatic restarts:

```Bash
npm run dev
```

Deployment (Render)
This project is optimized for deployment on Render.

1.Connect your GitHub repository to Render.

2.Set the Build Command to: npm install

3.Set the Start Command to: node app.js (or npm start)

4.Add all variables from your .env file to the Environment section in Render dashboard.
