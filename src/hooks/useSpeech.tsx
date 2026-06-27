/* eslint-disable react-hooks/exhaustive-deps */
import 'regenerator-runtime/runtime';
import { useEffect, useMemo, useRef, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

declare global {
  interface Window {
    keydownEventListenerAdded: boolean;
    keyupEventListenerAdded: boolean;
  }
}

const TOGGLE_KEY = 'q';
const PTT_KEY = 's';

const useSpeech = (textareaRef: React.RefObject<HTMLTextAreaElement | null>) => {
  const [isListening, setIsListening] = useState(false);
  const listeningRef = useRef<boolean>(false);

  const [inputValue, setInputValue] = useState('');
  const inputValueRef = useRef<string>('');

  const [transcriptValue, setTranscriptValue] = useState('');
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null);

  const cursorPosition = useRef(0);
  const micStreamRef = useRef<MediaStream | null>(null);

  const startListening = async () => {
    if (listeningRef.current) return;

    setMicPermissionError(null);

    try {
      if (!micStreamRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;
      }
    } catch (err) {
      const isDenied =
        err instanceof DOMException &&
        (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError');
      setMicPermissionError(
        isDenied
          ? 'Microphone access was denied. Please allow microphone access in your browser settings.'
          : 'Could not access microphone. Please check your browser settings.'
      );
      console.error('Microphone permission error:', err);
      return;
    }

    setIsListening(true);
    listeningRef.current = true;
    textareaRef.current?.focus();

    cursorPosition.current = textareaRef.current?.selectionStart || 0;

    try {
      SpeechRecognition.startListening({ language: 'en-US', continuous: true });
    } catch (error) {
      console.error('Error starting listening:', error);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    listeningRef.current = false;
    const recognition = SpeechRecognition.getRecognition();

    if (recognition) {
      recognition.continuous = false;
    }
    SpeechRecognition.abortListening();
    resetTranscript();
    SpeechRecognition.stopListening();

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
  };

  const handleTyping = (value: string) => {
    setInputValue(value);
    inputValueRef.current = value;
    cursorPosition.current = textareaRef.current?.selectionStart || 0;

    // cursorPosition.current = value.length + 1;
    resetTranscript();
  };

  const commands = useMemo(
    () => [
      {
        command: 'clear all',
        callback: ({ resetTranscript }: { resetTranscript: () => void }) => {
          setInputValue('');
          setTranscriptValue('');
          resetTranscript();
        }
      },
      {
        command: 'clear',
        callback: ({ resetTranscript }) => {
          // getTextArea().value = textAreaValue.current;
          setTranscriptValue('');
          resetTranscript();
        }
      },
      {
        command: 'stop listening',
        callback: () => {
          setTranscriptValue(transcriptValue.replace('stop listening', ''));
          stopListening();
        }
      },
      {
        command: 'submit',
        callback: () => {
          setTranscriptValue(transcriptValue.replace('submit', ''));
          setTimeout(() => {
            stopListening();
            // sendButton().click();
            // getTextArea().value = "";
          }, 1);
        }
      }
    ],
    [transcriptValue]
  );

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition({
    commands
  });

  if (!browserSupportsSpeechRecognition) {
    console.error('Speech recognition is not supported in this browser');
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!event.shiftKey && event.key === 'Enter') {
      stopListening();
    }

    if (event.ctrlKey && event.key === PTT_KEY) {
      event.preventDefault();
      startListening();
    }

    if (event.ctrlKey && event.key === TOGGLE_KEY) {
      event.preventDefault();
      if (listeningRef.current) {
        console.log('stop listening');
        stopListening();
      } else {
        console.log('start listening');
        startListening();
      }
    }
  };

  const handleKeyUp = async (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === PTT_KEY) {
      event.preventDefault();
      stopListening();
    }
  };

  const handleTextareaClick = () => {
    initForSpeech();
  };

  const initForSpeech = () => {
    setTranscriptValue('');
    resetTranscript();
    cursorPosition.current = textareaRef.current?.selectionStart || 0;
    inputValueRef.current = textareaRef.current?.value || '';
  };

  const handleTextareaFocus = () => {
    initForSpeech();
    if (browserSupportsSpeechRecognition) {
      startListening();
    }
  };

  const handleTextareaBlur = () => {
    stopListening();
  };

  useEffect(() => {
    setTranscriptValue(transcript);
  }, [transcript]);

  useEffect(() => {
    if (transcriptValue) {
      // console.log({
      //   transcriptValue,
      //   inputValueRef: inputValueRef.current
      // });

      const currentCursorPosition = cursorPosition.current;

      const value = `${inputValueRef.current.substring(
        0,
        currentCursorPosition
      )} ${transcriptValue} ${inputValueRef.current.substring(currentCursorPosition)}`;

      setInputValue(value);
    }
  }, [transcriptValue]);

  useEffect(() => {
    if (textareaRef.current && transcriptValue) {
      textareaRef.current.selectionEnd = cursorPosition.current + transcriptValue.length + 1;

      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  useEffect(() => {
    textareaRef.current?.addEventListener('click', handleTextareaClick);

    if (!window.keydownEventListenerAdded) {
      window.addEventListener('keydown', handleKeyDown);
      window.keydownEventListenerAdded = true;
    }
    if (!window.keyupEventListenerAdded) {
      window.addEventListener('keyup', handleKeyUp);
      window.keyupEventListenerAdded = true;
    }
    return () => {
      textareaRef.current?.removeEventListener('click', handleTextareaClick);
      if (window.keydownEventListenerAdded) {
        window.removeEventListener('keydown', handleKeyDown);
        window.keydownEventListenerAdded = false;
      }
      if (window.keyupEventListenerAdded) {
        window.removeEventListener('keyup', handleKeyUp);
        window.keyupEventListenerAdded = false;
      }
    };
  }, []);

  return {
    startListening,
    stopListening,
    inputValue,
    handleTyping,
    textareaRef,
    isListening,
    micPermissionError,
    browserSupportsSpeechRecognition,
    handleTextareaFocus,
    handleTextareaBlur,
  };
};

export default useSpeech;
