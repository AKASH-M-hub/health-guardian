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
    const { messages, userContext, mode } = await req.json();
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    
    if (!OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    const isConcise = mode === 'concise';
    
    const systemPrompt = `You are AKASHII, an AI Health Intelligence Agent for SDOP Health Guardian platform.

CRITICAL INSTRUCTIONS:
- ONLY answer health, wellness, medical, fitness, nutrition, and medical topics
- REFUSE non-health topics politely by saying: "I'm specialized in health topics. Please ask me about health, wellness, medicine, or fitness!"
- Provide SHORT, DIRECT, and PRACTICAL health advice
- NEVER diagnose or prescribe medications - recommend consulting doctors
- Be encouraging and empathetic
- Keep responses concise and structured

If user asks about: stress, sleep, exercise, diet, medicine, health risks, fitness, nutrition, symptoms, healthcare, hospitals, wellness → ANSWER IT
If user asks about: politics, sports, movies, programming, math, etc. → REFUSE POLITELY

${isConcise ? 'Keep response to 2-3 sentences maximum. Maximum 60 words.' : 'Keep response to 100-200 words.'}

${userContext ? `Context: ${userContext}` : ''}

Remember: You MUST stay on topic. Health only!`;

    // Convert messages format for OpenRouter (OpenAI compatible)
    const openrouterMessages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // Call OpenRouter API with Mistral model
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:8081',
        'X-Title': 'SDOP Health Guardian'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages: openrouterMessages,
        temperature: 0.5, // Lower temperature for more focused responses
        max_tokens: isConcise ? 120 : 500,
        top_p: 0.8
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      throw new Error(`OpenRouter API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    let aiMessage = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
    
    // Validate response is health-related
    const healthKeywords = ['health', 'medical', 'doctor', 'hospital', 'medicine', 'exercise', 'diet', 'sleep', 'stress', 'wellness', 'fitness', 'symptom', 'health risk', 'treatment', 'therapy', 'nutrition', 'disease', 'condition'];
    const lowerMessage = aiMessage.toLowerCase();
    const userQuestion = messages[messages.length - 1]?.content?.toLowerCase() || '';
    
    // Check if response is on-topic for health
    if (!healthKeywords.some(kw => lowerMessage.includes(kw)) && !healthKeywords.some(kw => userQuestion.includes(kw))) {
      aiMessage = "I'm specialized in health topics. Please ask me about health, wellness, medicine, fitness, nutrition, or healthcare!";
    }
    
    // Clean up markdown and formatting
    aiMessage = aiMessage
      .replace(/^#+\s+/gm, '') // Remove headers
      .replace(/###\s+/g, '\n') // Replace ### with newlines
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
      .replace(/_(.+?)_/g, '$1') // Remove italic
      .replace(/\[(.+?)\]\((.+?)\)/g, '$1') // Remove links
      .replace(/---+/g, '') // Remove dividers
      .replace(/^\s*#+\s+User:.*?(?=^\s*#+|$)/gms, '') // Remove User headers
      .replace(/^\s*#+\s+Assistant:.*?(?=^\s*#+|$)/gms, '') // Remove Assistant headers
      .trim();

    return new Response(JSON.stringify({ message: aiMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Health chat error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
