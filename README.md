# YouTube Downloader

A simple web application to download YouTube videos in full quality with audio.

## Features

- 🎬 Download YouTube videos in full quality
- 🔊 Includes audio automatically
- 📱 Responsive design
- ⚡ Fast and simple to use
- 🆓 Completely free

## Tech Stack

- **Frontend:** Next.js + React + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes
- **Video Processing:** ytdl-core

## Getting Started

### Local Development

1. **Install dependencies**
   ``ash
   npm install
   ``

2. **Run the development server**
   ``ash
   npm run dev
   ``

3. **Open in browser**
   - Navigate to http://localhost:3000

## Deployment to Vercel

### Step 1: Initialize Git Repository

``ash
cd youtube-downloader
git init
git add .
git commit -m "Initial commit: YouTube downloader app"
git branch -M main
``

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Create a repository named youtube-downloader
3. **Do NOT** initialize with README, .gitignore, or license
4. Click "Create repository"

### Step 3: Push to GitHub

Copy the commands from GitHub and run in your project directory:

``ash
git remote add origin https://github.com/YOUR_USERNAME/youtube-downloader.git
git push -u origin main
``

### Step 4: Deploy to Vercel

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click "New Project"
4. Select your youtube-downloader repository
5. Vercel will auto-detect Next.js settings
6. Click "Deploy"

Your site will be live in minutes! 🚀

## How to Use

1. Paste a YouTube video URL in the input field
2. Click "Fetch Info" to retrieve video details
3. Click "Download Video" to start the download
4. The video will be saved with full quality and audio

## Bandwidth Usage (Vercel Free Tier)

- **Free Limit:** 100GB/month
- **Small video (5 min, 480p):** ~50MB
- **Medium video (20 min, 720p):** ~200MB
- **Large video (1 hour, 1080p):** ~500MB-1GB

Check your Vercel dashboard to monitor bandwidth usage.

## Important Notes

⚠️ **Respect YouTube's Terms of Service:**
- Only download videos you have permission to download
- This tool is for personal use only
- Don't violate copyright laws

## Troubleshooting

### "Invalid YouTube URL" error
- Ensure you're using a complete YouTube URL
- Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ

### "Failed to fetch video" error
- The video might be private or restricted
- Try a different video

### Download is slow
- Depends on your internet speed
- Large videos take longer to process

## License

MIT License - Feel free to use this project
