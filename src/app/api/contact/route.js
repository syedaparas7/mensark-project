import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.json();
    console.log('Received formData in API:', formData); // 🔍 Debug here

    const googleScriptURL = 'https://script.google.com/macros/s/AKfycbze9a8u6FB5VhIhlz8_lBra46q1OiyafFgrrp5kWJ3thfb6qjrrIhL1bRYZrplxSzhpiA/exec';

    const response = await fetch(googleScriptURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    console.log('Google Script response:', result);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error in contact form API:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
