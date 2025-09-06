import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('URL parameter is missing', { status: 400 });
  }

  // Security: Sanitize and validate the URL
  let url: URL;
  try {
    // Handle cases where the URL value is percent-encoded (Next/Image encodes query again)
    // Try raw first; if it fails, try decoded once
    url = new URL(imageUrl);
  } catch (_) {
    try {
      const decoded = decodeURIComponent(imageUrl);
      url = new URL(decoded);
    } catch (_) {
      return new NextResponse('Invalid URL format', { status: 400 });
    }
  }

  // Security: Only allow proxying from a specific list of trusted domains from environment variables.
  const allowedHostnamesEnv = process.env.ALLOWED_IMAGE_HOSTNAMES; // e.g., "host1.com,host2.net"

  if (!allowedHostnamesEnv) {
    console.error('CRITICAL: ALLOWED_IMAGE_HOSTNAMES environment variable is not set.');
    return new NextResponse('Image proxy is not configured correctly.', { status: 500 });
  }

  const allowedHostnames = allowedHostnamesEnv.split(',').map(h => h.trim());

  const isHostnameAllowed = allowedHostnames.some(allowedHost => {
    // Exact match
    if (allowedHost === url.hostname) {
      return true;
    }
    // Wildcard subdomain match (e.g., *.example.com)
    if (allowedHost.startsWith('*.')) {
      const baseDomain = allowedHost.substring(2);
      if (url.hostname.endsWith(`.${baseDomain}`)) {
        return true;
      }
    }
    return false;
  });

  if (!isHostnameAllowed) {
    return new NextResponse(`Hostname not allowed. Access is restricted.`, { status: 403 });
  }

  try {
    // Fetch the image from the external source
    const imageResponse = await fetch(url.toString(), {
      headers: {
        // Forward any necessary headers, or keep it simple
      },
    });

    // Check if the external fetch was successful
    if (!imageResponse.ok) {
      return new NextResponse('Failed to fetch the image from the source.', { status: imageResponse.status });
    }

    // Get the raw image data as a ReadableStream
    const imageStream = imageResponse.body;

    // Get content type from the original response
    const contentType = imageResponse.headers.get('content-type') || 'application/octet-stream';
    
    // Stream the image back to the client
    return new NextResponse(imageStream, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache for a long time
      },
    });

  } catch (error) {
    console.error('Proxy error:', error);
    return new NextResponse('An internal error occurred while proxying the image.', { status: 500 });
  }
} 