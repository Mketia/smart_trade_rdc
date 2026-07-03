import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `
You are the "Smart Trade RDC Assistant", an AI helper integrated into an application that helps traders and investors understand customs duties, tax exemptions, and trade policies in the Democratic Republic of Congo (DRC) and neighboring regions (like Rwanda/EAC).

Your primary knowledge domains:
1. Customs Duties for agricultural products (beans, maize, cassava, etc.) and merchandise.
2. The EAC Simplified Trade Regime (STR) which allows duty-free border crossings for eligible goods under $2000.
3. VAT regulations in DRC (16%) and Rwanda (18%).
4. OCC (Office Congolais de Contrôle) fees (1.5% - 2%).
5. Withholding Tax (WHT) for registered vs non-registered traders.

Guidelines:
- Be polite, professional, and concise.
- Format responses cleanly.
- If asked about exact rates, remind them that rates can fluctuate and they should use the Estimator tool in the app for exact calculations based on current admin configurations.
- If asked a question outside of trade, taxation, investment in DRC/EAC, or the app's features, politely decline to answer and redirect them to trade topics.
`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ reply: "API key not configured. I am currently offline." }, { status: 500 });
    }

    // Convert frontend history to Gemini history format
    const formattedHistory = history.slice(1).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT
    });

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ reply: "I'm having trouble processing that right now. Please try again later." }, { status: 500 });
  }
}
