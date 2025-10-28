import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Simple lightweight connectivity check
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      ok: true,
      db: 'connected',
      env: {
        DEBUG: process.env.DEBUG ?? null,
        DATABASE_URL: process.env.DATABASE_URL ? 'present' : 'missing',
        DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED ? 'present' : 'missing',
        BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN ? 'present' : 'missing',
      },
    });
  } catch (error: any) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      {
        ok: false,
        error: error?.message,
        // Only include stack when DEBUG=true to avoid leaking secrets in production
        stack: process.env.DEBUG === 'true' ? error?.stack : undefined,
      },
      { status: 500 }
    );
  }
}
