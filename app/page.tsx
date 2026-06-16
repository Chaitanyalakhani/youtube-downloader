'use client';

import { useState } from 'react';

interface VideoInfo {
  videoId: string;
  title: string;
  duration: string;
  downloadUrl: string;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  const handleFetchInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch video');
      }

      setVideoInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!videoInfo) return;

    setDownloading(true);
    try {
      const response = await fetch(videoInfo.downloadUrl);

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${videoInfo.title}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  const formatDuration = (seconds: string) => {
    const total = parseInt(seconds);
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const secs = total % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-600 to-red-800 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            YouTube Downloader
          </h1>
          <p className="text-red-100 text-lg">
            Download YouTube videos in full quality with audio
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8 mb-8">
          {/* URL Input Form */}
          <form onSubmit={handleFetchInfo} className="mb-8">
            <label className="block text-gray-700 font-semibold mb-3">
              YouTube Video URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-red-500 transition"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Fetching...' : 'Fetch Info'}
              </button>
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-600 text-red-800 p-4 mb-6 rounded">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {/* Video Info Display */}
          {videoInfo && (
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {videoInfo.title}
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-1">
                    Duration
                  </p>
                  <p className="text-gray-800 text-lg">
                    {formatDuration(videoInfo.duration)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold mb-1">
                    Quality
                  </p>
                  <p className="text-gray-800 text-lg">Full Quality</p>
                </div>
              </div>

              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
              >
                {downloading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Downloading...
                  </>
                ) : (
                  <>
                    ⬇️ Download Video
                  </>
                )}
              </button>

              <p className="text-gray-500 text-sm text-center mt-4">
                Downloading full quality video with audio...
              </p>
            </div>
          )}

          {/* Info Section */}
          {!videoInfo && !error && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
              <h3 className="font-semibold text-blue-900 mb-2">
                How to use:
              </h3>
              <ol className="text-blue-800 text-sm space-y-1 list-decimal list-inside">
                <li>Paste a YouTube video URL above</li>
                <li>Click "Fetch Info" to retrieve video details</li>
                <li>Click "Download Video" to start downloading</li>
                <li>The video will be saved with full quality + audio</li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-red-100 text-sm">
          <p>Respects YouTube's terms of service. Download only content you have rights to.</p>
        </div>
      </div>
    </main>
  );
}
