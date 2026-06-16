import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');
    const quality = searchParams.get('quality') || '720';

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // Map quality to y2meta format
    const qualityMap: Record<string, string> = {
      '4k': '2160',
      '1080': '1080',
      '720': '720',
      '480': '480',
    };

    const mappedQuality = qualityMap[quality] || '720';

    // Redirect to y2mate with quality parameter
    const downloadUrl = `https://www.y2mate.com/en/download-youtube/${videoId}`;

    // Alternative: Use y2meta for direct downloads
    return NextResponse.redirect(
      `https://y2meta.com/?url=${youtubeUrl}&vt=mp4&q=${mappedQuality}`,
      { status: 303 }
    );
  } catch (error) {
    console.error('Stream error:', error);
    return NextResponse.json(
      { error: 'Failed to process download' },
      { status: 500 }
    );
  }
}
