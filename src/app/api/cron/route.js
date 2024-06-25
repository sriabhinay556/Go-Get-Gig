import { NextResponse } from 'next/server';

export async function GET() {
    console.log("from cron/route.js")
  return NextResponse.json({ ok: "message from cron/route.js" });
}