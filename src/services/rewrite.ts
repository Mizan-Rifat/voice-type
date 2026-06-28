import { supabase } from './supabase';

export const rewriteText = async (input: string, systemPrompt: string) => {
  const { data, error } = await supabase.functions.invoke<{ text?: string; error?: string }>(
    'rewrite',
    {
      body: { input, systemPrompt },
    }
  );

  if (error) {
    throw new Error(error.message);
  }
  if (data?.error) {
    throw new Error(data.error);
  }

  return data?.text ?? '';
};
