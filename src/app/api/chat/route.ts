import {NextRequest, NextResponse} from 'next/server';
import {chat, ChatInput} from '@/ai/flows/chat-flow';

export async function POST(req: NextRequest) {
  try {
    const {message, history} = (await req.json()) as ChatInput;

    if (!message) {
      return NextResponse.json(
        {error: 'Message is required.'},
        {status: 400}
      );
    }

    const response = await chat({message, history});

    return NextResponse.json(response);
  } catch (err: any) {
    console.error('[Chat Error]', err);
    return NextResponse.json(
      {error: err.message || 'An unexpected error occurred.'},
      {status: 500}
    );
  }
}
