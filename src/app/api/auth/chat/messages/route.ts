import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: 'Hello from the API!' })
}

export async function POST(req: NextRequest) {
  return NextResponse.json({ message: 'Posted data!' })
}
