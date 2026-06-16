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
    const encodedUrl = encodeURIComponent(youtubeUrl);

    // Use ssyoutube - fastest service
    // Map quality to ssyoutube format
    const qualityMap: Record<string, string> = {
      '4k': '720',
      '1080': '720',
      '720': '720',
      '480': '360',
    };

    const mappedQuality = qualityMap[quality] || '720';

    // Direct redirect to ssyoutube with quality parameter
    return NextResponse.redirect(
      `https://ssyoutube.com/?url=${encodedUrl}&quality=${mappedQuality}p`,
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
