
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const isDebug = process.env.DEBUG === 'true' || process.env.NODE_ENV !== 'production';

  if (request.headers.get('x-debug-on')) {
    process.env.DEBUG = 'true';
    return NextResponse.json({ message: 'Debug mode enabled.' });
  }

  if (request.headers.get('x-debug-off')) {
    process.env.DEBUG = 'false';
    return NextResponse.json({ message: 'Debug mode disabled.' });
  }

  return NextResponse.json({
    message: 'Debug endpoint. Use x-debug-on/x-debug-off headers to control.',
    isDebug,
  });
}
