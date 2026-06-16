import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'youtube-dl-exec';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const title = searchParams.get('title') || 'video';

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    const result = await exec(url, {
      format: 'best[ext=mp4]',
      quiet: true,
      noWarnings: true,
      getUrl: true,
    });

    const downloadUrl = Array.isArray(result) ? result[0] : result;

    if (!downloadUrl) {
      return NextResponse.json(
        { error: 'Could not generate download link' },
        { status: 400 }
      );
    }

    return NextResponse.redirect(downloadUrl, { status: 303 });
  } catch (error) {
    console.error('Stream error:', error);
    return NextResponse.json(
      { error: 'Failed to prepare download' },
      { status: 500 }
    );
  }
}
