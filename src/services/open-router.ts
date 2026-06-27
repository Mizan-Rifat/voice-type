import { OpenRouter } from '@openrouter/sdk';

const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

if (!apiKey) {
  console.warn('VITE_OPENROUTER_API_KEY is not set. AI rewrite will not work.');
}

const openRouterClient = new OpenRouter({
  apiKey: apiKey ?? '',
  appTitle: 'VoiceType'
});

export const rewriteText = async (input: string, systemPrompt: string) => {
  const completion = await openRouterClient.chat.send({
    chatRequest: {
      model: 'openai/gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: input }
      ]
    }
  });

  return completion.choices[0]?.message?.content ?? '';
};

export default openRouterClient;
