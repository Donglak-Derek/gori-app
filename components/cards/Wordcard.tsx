"use client";

import { Button } from "../ui/button";
import ReactPlayer from "react-player";
// import ReactPlayer from "react-player/youtube";

import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";
import { useEffect, useState } from "react";

interface Props {
  id: string;
  url: string;
  cardNumber: any;
  kind: string;
  smallTitle: string;
  korean: string;
  english: string;
  currentUserId: string;
  onNext: () => void;
}

export default function WordCard({
  id,
  url,
  cardNumber,
  kind,
  smallTitle,
  korean,
  english,
  currentUserId,
  onNext,
}: Props) {
  // function cleanString(str: string) {
  //   return str.replace(/^"|"$/g, "");
  // }

  // // clean string from stringify
  // url = cleanString(url);
  // id = cleanString(id);
  // kind = cleanString(kind);
  // smallTitle = cleanString(smallTitle);
  // korean = cleanString(korean);
  // english = cleanString(english);
  // cardNumber = cleanString(cardNumber);

  const isListening = "Listening";
  const [video, setVideo] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(true); // State to manage play/pause
  const [currentPauseIndex, setCurrentPauseIndex] = useState(0); // To keep track of the current pause point
  const pausePoints = [4, 8, 12]; // Times at which you want to pause the video

  useEffect(() => {
    setVideo(
      <ReactPlayer
        url={url}
        height="100%"
        width="100%"
        controls={true}
        playing={isPlaying} // Add this line for autoplay
        onPlay={() => setIsPlaying(true)} // Listen for play event
        onPause={() => setIsPlaying(false)} // Listen for pause event
        onProgress={({ playedSeconds }) => {
          if (
            currentPauseIndex < pausePoints.length &&
            playedSeconds >= pausePoints[currentPauseIndex]
          ) {
            setIsPlaying(false);
            setCurrentPauseIndex(currentPauseIndex + 1);
          }
        }}
        className=" bg-dark-1 overflow-hidden"
      />
    );
  }, [isPlaying, currentPauseIndex]);

  const handleVideoPause = () => {
    // logic to show modal goes here
    console.log("handleVideoPause");
  };

  const handleNextClick = () => {
    onNext(); // move to the next card
    setIsPlaying(true); // resume video playing
  };

  return (
    <article className="wordCard">
      {kind === "lectureCard" ? (
        <div className="relative h-[45rem] w-full">{video}</div>
      ) : (
        <div className="w-full h-94 grid grid-cols-1 grid-flow-col-dense grid-rows-6 gap-4">
          <div className="row-span-1 grid grid-cols-3 gap-1 items-center">
            <div className="text-light-1">{currentUserId}</div>
            <div className="text-center">
              {isListening === "Listening" && (
                <p className="bg-green-500 rounded-lg py-3 text-base-medium text-gray-900">
                  I am listening...
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <Button className="text-sm text-gray-500 ">Save</Button>
            </div>
          </div>

          <div className="row-start-2 row-end-4 h-48 flex justify-center items-center">
            <h4 className="cursor-pointer text-heading2-semibold text-white">
              {korean}
            </h4>
          </div>

          <div className="flex justify-center items-center">
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full w-28 h-28 text-heading4-medium"
            >
              Play
            </Button>
          </div>

          <div className=" flex justify-center items-center">
            <p className="text-sm text-white">{english}</p>
          </div>

          <div className="flex justify-center items-center">
            <Button size="lg" variant="ghost" onClick={handleNextClick}>
              Next
            </Button>
          </div>
        </div>
      )}
    </article>
  );
}
