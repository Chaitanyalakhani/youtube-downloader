import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

function extractVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL' },
        { status: 400 }
      );
    }

    try {
      const response = await axios.get(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
        { timeout: 5000 }
      );

      const title = response.data.title
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '_')
        .slice(0, 50);

      return NextResponse.json({
        videoId,
        title: response.data.title,
        duration: '0',
        downloadUrl: `/api/stream?videoId=${videoId}&title=${title}`,
      });
    } catch {
      return NextResponse.json({
        videoId,
        title: `Video ${videoId}`,
        duration: '0',
        downloadUrl: `/api/stream?videoId=${videoId}&title=video`,
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video info' },
      { status: 500 }
    );
  }
}
