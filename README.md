# HabitStack 🧠

A simple habit tracker I built to keep track of my daily habits and, more importantly, to practice building a proper full-stack application.

I wanted something more than just a basic To-Do app, so I added things like streak tracking, weekly progress and an activity heatmap.

## What can it do?

- Create new habits
- Mark habits as completed for the day
- Delete habits
- Track current streaks
- Track longest streaks
- See weekly completion percentage
- See your activity through a heatmap
- See your habits and their progress for the current week
- User authentication so everyone's habits stay separate

## Tech I used

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Axios

### Authentication
- JWT

## A little about the project

This project started as a simple habit tracker, but I ended up adding quite a few things while building it.

One of the more interesting parts for me was the streak calculation. I had to work with dates, compare consecutive days and figure out both the current streak and the longest streak.

I also built the weekly completion calculation and the activity heatmap by going through the user's completed dates and calculating how many habits were completed on each day.

The UI was also something I spent a good amount of time on because I wanted it to feel like an actual application rather than just a page with a bunch of buttons.

## What I learned

While building this project I got more comfortable with:

- Working with APIs from the frontend
- Connecting a Next.js frontend to an Express backend
- Using MongoDB for storing user and habit data
- JWT authentication
- Managing state with React
- TypeScript types
- Working with JavaScript dates
- Calculating streaks and progress
- Building reusable UI with Tailwind CSS
- Handling CRUD operations

## Running the project locally

### Frontend

```bash
npm install
npm run dev