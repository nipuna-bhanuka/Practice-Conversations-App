import { useCallback, useEffect } from 'react';

const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

function pickVoice() {
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => /en-GB|en-IN|en-LK/i.test(v.lang)) ?? voices.find((v) => /^en/i.test(v.lang));
}

export function useSpeechSynthesis() {
  useEffect(() => {
    if (!supported) return;
    window.speechSynthesis.getVoices(); // warm up the voice list
    return () => window.speechSynthesis.cancel();
  }, []);

  const speak = useCallback((text: string) => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice();
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  }, []);

  const stop = useCallback(() => {
    if (supported) window.speechSynthesis.cancel();
  }, []);

  return { speak, stop, supported };
}
