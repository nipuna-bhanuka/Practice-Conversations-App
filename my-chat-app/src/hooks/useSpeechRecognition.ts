import { useCallback, useRef, useState } from 'react';

/* Minimal typings — the Web Speech API isn't in TypeScript's DOM lib yet */
interface RecognitionResult {
  isFinal: boolean;
  0: { transcript: string };
}
interface RecognitionEvent {
  resultIndex: number;
  results: ArrayLike<RecognitionResult>;
}
interface Recognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: RecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}
type RecognitionCtor = new () => Recognition;

const w = typeof window !== 'undefined'
  ? (window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor })
  : undefined;
const Ctor: RecognitionCtor | undefined = w?.SpeechRecognition ?? w?.webkitSpeechRecognition;

/** Streams what the user says into `onText`. */
export function useSpeechRecognition(onText: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<Recognition | null>(null);

  const stop = useCallback(() => {
    ref.current?.stop();
    setListening(false);
  }, []);

  const start = useCallback(() => {
    if (!Ctor) return;
    const r = new Ctor();
    r.lang = 'en-GB';
    r.interimResults = true;
    r.continuous = false;
    let final = '';
    r.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const res = e.results[i];
        if (res.isFinal) final += res[0].transcript;
        else interim += res[0].transcript;
      }
      onText((final + interim).trim());
    };
    r.onerror = () => {
      setListening(false);
      setError('Microphone unavailable or blocked.');
    };
    r.onend = () => setListening(false);
    ref.current = r;
    setError(null);
    setListening(true);
    r.start();
  }, [onText]);

  const toggle = useCallback(() => (listening ? stop() : start()), [listening, start, stop]);

  return { listening, toggle, stop, error, supported: !!Ctor };
}
