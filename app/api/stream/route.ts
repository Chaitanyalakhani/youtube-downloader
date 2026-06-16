import { NextRequest, NextResponse } from 'next/server';
import ytdl from 'ytdl-core';

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

    const url = `https://www.youtube.com/watch?v=${videoId}`;

    const info = await ytdl.getInfo(videoId);

    // Get the highest quality format with audio
    const formats = ytdl.chooseFormat(info.formats, {
      quality: 'highest',
      filter: (format) => format.hasAudio && format.hasVideo,
    });

    if (!formats) {
      return NextResponse.json(
        { error: 'No suitable format found' },
        { status: 400 }
      );
    }

    const stream = ytdl(url, { format: formats });

    return new NextResponse(stream as any, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="${title}.mp4"`,
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Stream error:', error);
    return NextResponse.json(
      { error: 'Failed to stream video' },
      { status: 500 }
    );
  }
}
