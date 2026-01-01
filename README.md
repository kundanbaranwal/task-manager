# Assignment

Hey, this is my submission for the MERN stack intern assignment. I've built a full-stack task management application using React, Node.js, Express, and MongoDB.

## What I Built

It's a task manager where users can sign up, log in, and manage their own tasks. I also implemented an Admin role that has special privileges:

- **Admins** can see all users and delete them.
- When an admin deletes a user, all their tasks are automatically deleted too (Cascade Delete).
- I used **Redis** to cache tasks so the app is faster.

## How to Run It

I've split the project into `client` and `server` folders. You'll need Node.js and MongoDB running.

### Backend Setup

1. Go into the `server` folder: `cd server`
2. Install the packages: `npm install`
3. Make sure you have a `.env` file with your Mongo URI, JWT secret, and Redis port.
4. Run it with `npm run dev`. It runs on port 5000.

### Frontend Setup

1. Open a new terminal and go to `client`: `cd client`
2. Install packages: `npm install`
3. Run it: `npm run dev`

The app should pop up at `http://localhost:5173`.

Let me know if you have any questions!
