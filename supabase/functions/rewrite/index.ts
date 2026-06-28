// Supabase Edge Function: rewrite
//
// Holds the OpenRouter API key server-side so it is never shipped to the
// browser. Supabase verifies the caller's JWT before this runs (verify_jwt is
// on by default), so only authenticated users can invoke it.
//
// Deploy:  supabase functions deploy rewrite
// Secret:  supabase secrets set OPENROUTER_API_KEY=sk-or-...

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const apiKey = Deno.env.get('OPENROUTER_API_KEY');
  if (!apiKey) {
    return json({ error: 'OPENROUTER_API_KEY is not configured.' }, 500);
  }

  let input: unknown;
  let systemPrompt: unknown;
  let model: unknown;
  try {
    const body = await req.json();
    input = body.input;
    systemPrompt = body.systemPrompt;
    model = body.model;
  } catch {
    return json({ error: 'Invalid JSON body.' }, 400);
  }

  if (typeof input !== 'string' || !input.trim()) {
    return json({ error: 'Field "input" is required.' }, 400);
  }
  if (typeof systemPrompt !== 'string') {
    return json({ error: 'Field "systemPrompt" is required.' }, 400);
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Title': 'VoiceType',
      },
      body: JSON.stringify({
        model: typeof model === 'string' && model ? model : 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: input },
        ],
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      return json({ error: `OpenRouter error: ${response.status} ${detail}` }, 502);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content ?? '';
    return json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected error.';
    return json({ error: message }, 500);
  }
});
