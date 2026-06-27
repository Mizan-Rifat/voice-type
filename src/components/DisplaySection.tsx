import { Copy, Check, Terminal, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface DisplaySectionProps {
  text: string;
  isLoading?: boolean;
  error?: string | null;
  showPlaceholder?: boolean;
}

const DisplaySection = ({
  text,
  isLoading = false,
  error = null,
  showPlaceholder = false,
}: DisplaySectionProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="w-full max-w-2xl mt-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="relative group bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
        {text && !isLoading && (
          <div className="absolute top-4 right-4 print:hidden">
            <button
              onClick={handleCopy}
              className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium
                ${
                  copied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                }
              `}
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check size={16} />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={16} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}

        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Terminal size={14} />
          Output
        </h3>

        {isLoading && (
          <div className="flex items-center gap-3 text-gray-500">
            <Loader2 size={20} className="animate-spin" />
            <span>Generating...</span>
          </div>
        )}

        {error && !isLoading && (
          <p className="text-red-600 text-base leading-relaxed">{error}</p>
        )}

        {!isLoading && !error && text && (
          <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-wrap font-medium">
            {text}
          </p>
        )}

        {showPlaceholder && (
          <p className="text-gray-400 text-base leading-relaxed">
            Type or speak — your text will appear here. Use the sparkles button to rewrite with AI.
          </p>
        )}
      </div>
    </div>
  );
};

export default DisplaySection;
