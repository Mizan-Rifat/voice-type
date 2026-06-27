export type Prompt = {
  id: string;
  title: string;
  description: string;
  prompt: string;
};

export const PROMPTS: Prompt[] = [
  {
    id: 'casual-conversational',
    title: 'Casual & Conversational',
    description: 'Rewrite like natural spoken language — relaxed, no stiff grammar.',
    prompt:
      'Rewrite the following text in a casual, conversational tone — like how someone would actually say it out loud. Keep it natural and relaxed. Do not worry about strict subject–object structure or formal sentence rules. Preserve the meaning. Return only the rewritten text.'
  },
  {
    id: 'fix-grammar',
    title: 'Fix Grammar',
    description: 'Correct grammar, spelling, and punctuation.',
    prompt:
      'Fix grammar, spelling, and punctuation in the following text. Preserve the original meaning and tone. Return only the corrected text.'
  },
  {
    id: 'teach-grammar',
    title: 'Teach Grammar',
    description: 'Correct the text and explain grammar mistakes only.',
    prompt:
      'Review the following text. Fix all grammar, spelling, and punctuation in the corrected output, but only explain grammar mistakes — do not explain spelling or punctuation fixes.\n\nUse this format:\n\n**Corrected text:**\n[the fully corrected version with proper grammar, spelling, and punctuation]\n\n**What was wrong & how to fix it:**\n- [original phrase] → [corrected phrase]: [brief explanation of the grammar rule or mistake]\n\nInclude only grammar issues in the explanation list. Apply spelling and punctuation corrections silently in **Corrected text** without mentioning them. If there are no grammar errors, say so and return the corrected text under **Corrected text:** with a note that no grammar changes were needed.'
  },
  {
    id: 'formalize',
    title: 'Formalize',
    description: 'Rewrite the text in a professional, formal tone.',
    prompt:
      'Rewrite the following text in a professional, formal tone. Preserve the original meaning and key details. Return only the rewritten text.'
  },
  {
    id: 'summarize',
    title: 'Summarize',
    description: 'Condense the text into a brief summary.',
    prompt:
      'Summarize the following text concisely while keeping the most important points. Return only the summary.'
  },
  {
    id: 'make-concise',
    title: 'Make Concise',
    description: 'Shorten the text without losing meaning.',
    prompt:
      'Make the following text more concise without losing important meaning. Return only the shortened text.'
  },
  {
    id: 'friendly-tone',
    title: 'Friendly Tone',
    description: 'Rewrite the text in a warm, friendly voice.',
    prompt:
      'Rewrite the following text in a warm, friendly, approachable tone. Preserve the original meaning. Return only the rewritten text.'
  }
];
