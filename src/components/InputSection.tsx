import { Mic, MicOff, Sparkles, XIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type { Prompt } from '../data/prompts';
import useRewrite from '../hooks/useRewrite';
import useSpeech from '../hooks/useSpeech';
import DisplaySection from './DisplaySection';

interface InputSectionProps {
  selectedPrompt: Prompt;
}

const InputSection = ({ selectedPrompt }: InputSectionProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const {
    startListening,
    stopListening,
    inputValue,
    handleTyping,
    isListening,
    micPermissionError,
    browserSupportsSpeechRecognition,
    handleTextareaFocus,
    handleTextareaBlur,
  } = useSpeech(textareaRef);

  const { output, isGenerating, error, rewrite, reset } = useRewrite();

  useEffect(() => {
    reset();
  }, [inputValue, reset]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleRewrite = () => {
    rewrite(inputValue, selectedPrompt.prompt);
  };

  const displayText = output || inputValue;

  return (
    <>
      <div className="w-full max-w-2xl relative group z-10">
        <div
          className={`
          relative flex items-center w-full bg-white rounded-3xl shadow-lg border border-gray-200 
          transition-all duration-300 ease-in-out hover:shadow-xl focus-within:shadow-2xl focus-within:border-blue-300
          ${isListening ? 'ring-4 ring-blue-100 border-blue-400' : ''}
          ${micPermissionError ? 'border-red-300' : ''}
      `}
        >
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={e => handleTyping(e.target.value)}
            onFocus={handleTextareaFocus}
            onBlur={handleTextareaBlur}
            placeholder="Start typing or speaking..."
            rows={1}
            className="w-full py-4 px-4 text-lg text-gray-700 bg-transparent outline-none resize-none overflow-hidden placeholder-gray-400"
            style={{ minHeight: '60px', maxHeight: '300px' }}
          />

          <div className="flex self-end pr-4 py-4 gap-2">
            {!browserSupportsSpeechRecognition ? (
              <div
                className="p-3 rounded-full text-gray-300 cursor-not-allowed"
                title="Speech recognition is not supported in this browser"
              >
                <MicOff size={20} />
              </div>
            ) : (
              <button
                type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={toggleListening}
                className={`
                p-3 rounded-full transition-all duration-300 relative cursor-pointer
                ${
                  isListening
                    ? 'bg-red-500 text-white hover:bg-red-600 animate-pulse shadow-md'
                    : micPermissionError
                      ? 'bg-red-50 text-red-400 hover:bg-red-100'
                      : 'hover:bg-gray-100 text-gray-500 hover:text-blue-600'
                }
              `}
                title={micPermissionError ? micPermissionError : 'Voice Input'}
              >
                <Mic size={20} />
                {isListening && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping" />
                )}
              </button>
            )}

            <button
              type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={handleRewrite}
              disabled={!inputValue.trim() || isGenerating}
              className="p-3 rounded-full transition-all duration-300 text-gray-500 hover:bg-purple-50 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
              title={`Rewrite with ${selectedPrompt.title}`}
            >
              <Sparkles size={20} className={isGenerating ? 'animate-pulse' : ''} />
            </button>

            <button
              type="button"
              onMouseDown={e => e.preventDefault()}
              onClick={() => handleTyping('')}
              className="p-3 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!inputValue.trim()}
              title="Clear"
            >
              <XIcon size={20} />
            </button>
          </div>
        </div>

        {micPermissionError && (
          <p className="mt-2 px-4 text-sm text-red-500">{micPermissionError}</p>
        )}
      </div>
      <DisplaySection
        text={displayText}
        isLoading={isGenerating}
        error={error}
        showPlaceholder={!displayText && !isGenerating && !error}
      />
    </>
  );
};

export default InputSection;
