import { useRef, useState, useEffect } from "react";

type SpeechRecognition =
  | typeof window.SpeechRecognition
  | typeof window.webkitSpeechRecognition;

const useMediaRecorder = (
  recognition: InstanceType<SpeechRecognition> | null,
  startRecordingSound: string
) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [stoppedManually, setStoppedManually] = useState(false);

  const startRecording = async () => {
    const startSound = new Audio(startRecordingSound);
    startSound.play();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    // Handle the dataavailable event
    mediaRecorder.ondataavailable = (event) => {
      setAudioBlob(event.data);
    };

    mediaRecorder.start();
    setRecording(true);

    // Clear userSpeech when start recording
    if (recognition) {
      recognition.start();
    }
  };

  const stopRecording = () => {
    const startSound = new Audio(startRecordingSound);
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setStoppedManually(true); // Set this flag when stop recording
    }

    if (recognition) {
      recognition.stop();
    }
    startSound.play();
  };

  useEffect(() => {
    if (!recording && stoppedManually && audioBlob) {
      URL.revokeObjectURL(URL.createObjectURL(audioBlob));
      setAudioBlob(null);
      setStoppedManually(false);
    }
  }, [recording, stoppedManually, audioBlob]);

  return {
    mediaRecorderRef,
    setRecording,
    recording,
    audioBlob,
    setAudioBlob,
    startRecording,
    stopRecording,
    stoppedManually,
    setStoppedManually,
  };
};

export default useMediaRecorder;
