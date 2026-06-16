import { NextRequest, NextResponse } from 'next/server';
import ytdl from 'ytdl-core';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    if (!ytdl.validateURL(url)) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    const videoId = ytdl.getVideoID(url);
    const info = await ytdl.getInfo(videoId);

    const title = info.videoDetails.title
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '_')
      .slice(0, 50);

    return NextResponse.json({
      videoId,
      title: info.videoDetails.title,
      duration: info.videoDetails.lengthSeconds,
      downloadUrl: `/api/stream?videoId=${videoId}&title=${title}`,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video info' },
      { status: 500 }
    );
  }
}
