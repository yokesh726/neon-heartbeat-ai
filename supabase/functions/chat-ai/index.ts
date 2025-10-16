import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, history } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build conversation context
    const messages = [
      {
        role: 'system',
        content: `You are MoodEmoji, an empathetic AI companion that responds to users' emotional states. 
        
Guidelines:
- Detect the user's mood from their message (happy, sad, angry, anxious, excited, calm, lonely, joyful, jealous, neutral)
- Respond with empathy matching their emotional state
- Be supportive, warm, and caring
- Keep responses concise but meaningful
- Use appropriate emojis to match the mood
- If they're happy: be cheerful and enthusiastic
- If they're sad: be gentle and supportive
- If they're angry: be calming and understanding
- If they're anxious: be reassuring and comforting

At the end of your response, add a line starting with "DETECTED_MOOD:" followed by the detected mood (lowercase, one word).`
      },
      ...(history || []).slice(-5).map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      {
        role: 'user',
        content: message
      }
    ];

    // Call Lovable AI
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Extract mood from response
    let detectedMood = 'neutral';
    const moodMatch = aiResponse.match(/DETECTED_MOOD:\s*(\w+)/i);
    if (moodMatch) {
      detectedMood = moodMatch[1].toLowerCase();
    }

    // Remove mood indicator from response
    const cleanResponse = aiResponse.replace(/DETECTED_MOOD:\s*\w+/gi, '').trim();

    return new Response(
      JSON.stringify({
        response: cleanResponse,
        detected_mood: detectedMood,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in chat-ai function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});