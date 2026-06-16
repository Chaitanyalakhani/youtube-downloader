import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');
    const quality = searchParams.get('quality') || 'best';

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const services = [
      `https://y2meta.com/api/ajaxSearch/index?v=${videoId}`,
      `https://www.y2mate.com/api/ajaxSearch/index?v=${videoId}`,
    ];

    for (const serviceUrl of services) {
      try {
        const response = await fetch(serviceUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://y2meta.com/',
          },
        });

        if (!response.ok) continue;

        const data = await response.json();

        if (data.links?.mp4) {
          const formats = data.links.mp4;

          let selectedFormat;

          if (quality === '720') {
            selectedFormat = formats.find((f: any) => f.quality?.includes('720'));
          } else if (quality === '480') {
            selectedFormat = formats.find((f: any) => f.quality?.includes('480'));
          } else if (quality === 'high') {
            selectedFormat = formats[Math.min(1, formats.length - 1)];
          } else {
            selectedFormat = formats[0];
          }

          if (selectedFormat?.url) {
            return NextResponse.redirect(selectedFormat.url, { status: 303 });
          }
        }
      } catch {
        continue;
      }
    }

    return NextResponse.redirect(
      `https://y2meta.com/?url=${youtubeUrl}`,
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
