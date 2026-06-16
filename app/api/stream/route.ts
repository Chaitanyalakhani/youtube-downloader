import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');
    const title = searchParams.get('title') || 'video';

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const downloadServiceUrl = `https://y2meta.com/api/ajaxSearch/index?v=${videoId}`;

    try {
      const response = await fetch(downloadServiceUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://y2meta.com/',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to get download links');
      }

      const data = await response.json();

      if (data.links && data.links.mp4 && data.links.mp4[0]) {
        const downloadUrl = data.links.mp4[0].url;
        return NextResponse.redirect(downloadUrl, { status: 303 });
      }

      return NextResponse.json(
        { error: 'No download links available' },
        { status: 400 }
      );
    } catch (error) {
      console.error('Download service error:', error);

      return NextResponse.redirect(
        `https://y2meta.com/?url=${youtubeUrl}`,
        { status: 303 }
      );
    }
  } catch (error) {
    console.error('Stream error:', error);
    return NextResponse.json(
      { error: 'Failed to process download' },
      { status: 500 }
    );
  }
}
