import { NextRequest, NextResponse } from 'next/server';

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

    let title = `Video ${videoId}`;

    try {
      const response = await fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
        { signal: AbortSignal.timeout(5000) }
      );

      if (response.ok) {
        const data = await response.json();
        title = data.title
          .replace(/[^\w\s]/g, '')
          .replace(/\s+/g, '_')
          .slice(0, 50);
      }
    } catch {
      // If title fetch fails, use default
    }

    return NextResponse.json({
      videoId,
      title: title,
      duration: '0',
      qualities: [
        {
          name: '4K (2160p)',
          quality: '4k',
          downloadUrl: `/api/stream?videoId=${videoId}&quality=4k`,
        },
        {
          name: '1080p (Full HD)',
          quality: '1080',
          downloadUrl: `/api/stream?videoId=${videoId}&quality=1080`,
        },
        {
          name: '720p (HD)',
          quality: '720',
          downloadUrl: `/api/stream?videoId=${videoId}&quality=720`,
        },
      ],
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video info' },
      { status: 500 }
    );
  }
}
