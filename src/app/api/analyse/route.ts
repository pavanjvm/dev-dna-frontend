import {NextRequest, NextResponse} from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('pdf');

    if (!file) {
      return NextResponse.json({error: 'No file provided'}, {status: 400});
    }

    const backendUrl = 'http://localhost:3000/analyse'; 

    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      body: formData,
    });

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error('Backend error:', errorText);
      return NextResponse.json(
        {error: `Backend error: ${backendResponse.statusText}`, details: errorText},
        {status: backendResponse.status}
      );
    }

    const data = await backendResponse.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      {error: 'Internal Server Error', details: error.message},
      {status: 500}
    );
  }
}
