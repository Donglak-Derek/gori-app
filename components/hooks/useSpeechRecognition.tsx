import { useEffect, useState } from "react";

export const useSpeechRecognition = () => {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );
  const [isListening, setIsListening] = useState(false);
  const [userSpeech, setUserSpeech] = useState("");

  useEffect(() => {
    if (window.SpeechRecognition || (window as any).webkitSpeechRecognition) {
      const SpeechRecognition =
        window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = "ko-KR";

      let silenceTimer: NodeJS.Timeout;

      recognitionInstance.onresult = function (event) {
        let transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");
        if (transcript) {
          setUserSpeech(transcript);
        }

        clearTimeout(silenceTimer);
        silenceTimer = setTimeout(() => {
          if (recognitionInstance) {
            recognitionInstance.stop();
            setIsListening(false);
          }
        }, 1000);
      };

      setRecognition(recognitionInstance);
    } else {
      console.warn("SpeechRecognition is not supported in this browser.");
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return {
    recognition,
    setRecognition,
    isListening,
    setIsListening,
    userSpeech,
    setUserSpeech,
    startListening,
    stopListening,
  };
};
