
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const backendResponse = await fetch('http://localhost:3001/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!backendResponse.ok) {
      const errorBody = await backendResponse.text();
      // We forward the error from the backend
      return new NextResponse(errorBody, {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
      });
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Error proxying to /query:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      { status: 500 }
    );
  }
}
