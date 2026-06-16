import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'youtube-dl-exec';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'YouTube URL is required' },
        { status: 400 }
      );
    }

    const infoJson = await exec(url, {
      dumpJson: true,
      noWarnings: true,
    });

    const info = typeof infoJson === 'string' ? JSON.parse(infoJson) : infoJson;
    const videoId = info.id;
    const title = info.title
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, '_')
      .slice(0, 50);

    return NextResponse.json({
      videoId,
      title: info.title,
      duration: info.duration.toString(),
      downloadUrl: `/api/stream?url=${encodeURIComponent(url)}&title=${title}`,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video info. Make sure the URL is correct and the video is accessible.' },
      { status: 500 }
    );
  }
}
