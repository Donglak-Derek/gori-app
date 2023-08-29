import { useCallback, useState } from "react";

/**
 * Custom hook for speech synthesis
 *
 * @param {string} text - The text to be synthesized
 * @param {string} lang - The language in which to synthesize the text
 * @returns {Function} - A function to start the speech synthesis
 */
export function useSpeechSynthesis() {
  // State to check if it's speaking
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Function to start the speech synthesis
  const speak = useCallback(
    (text: string, lang: string = "en-US") => {
      return new Promise<void>((resolve, reject) => {
        if (isSpeaking) {
          reject(new Error("Speech synthesis is already in progress"));
          return;
        }

        setIsSpeaking(true); // Set speaking to true

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.volume = 1;
        utterance.rate = 0.8;
        utterance.pitch = 1;

        // Execute callback function when speech ends
        utterance.onend = function () {
          setIsSpeaking(false); // Set speaking to false
          resolve(); // Resolve the promise
        };

        window.speechSynthesis.speak(utterance);
      });
    },
    [isSpeaking]
  );

  return speak;
}
