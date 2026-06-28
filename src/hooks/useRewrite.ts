import { useCallback, useState } from 'react';
import { rewriteText } from '../services/rewrite';

const useRewrite = () => {
  const [output, setOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rewrite = async (inputText: string, promptText: string) => {
    if (!inputText.trim()) return null;

    setIsGenerating(true);
    setError(null);

    try {
      const result = await rewriteText(inputText, promptText);
      setOutput(result);
      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to generate text. Please try again.';
      setError(message);
      setOutput('');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = useCallback(() => {
    setOutput('');
    setError(null);
    setIsGenerating(false);
  }, []);

  return { output, isGenerating, error, rewrite, reset };
};

export default useRewrite;
