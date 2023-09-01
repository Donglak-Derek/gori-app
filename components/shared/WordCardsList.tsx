"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import WordCard from "../cards/WordCard";

import Modal from "../cards/Modal";
import ReactPlayer from "react-player";

interface WordCard {
  _id: string;
  url: string;
  cardNumber: any;
  kind: string;
  smallTitle: string;
  korean: string;
  english: string;
  currentUserId: string;
}

interface User {
  id: string;
  username: string;
  // add other fields
}

interface Result {
  wordcards: WordCard[];
  // add other fields
}

// TODO: make this Props right instead of any
interface Props {
  user: any;
  result: any;
}

export default function WordCardsList({ user, result }: Props) {
  //deserialize
  const deUserInfo = JSON.parse(user);
  const deResult = JSON.parse(result);

  const [currentWordCardIndex, setCurrentWordCardIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [currentPauseIndex, setCurrentPauseIndex] = useState(0);
  const pausePoints = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36]; // Times to pause video
  const router = useRouter();

  // video
  const [video, setVideo] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleNext = () => {
    setCurrentWordCardIndex(currentWordCardIndex + 1);
    toggleModal();
    setIsPlaying(true);
  };

  useEffect(() => {
    if (currentPauseIndex === 0) {
      setShowModal(false); // Hide the modal initially
    } else if (currentPauseIndex < pausePoints.length) {
      setShowModal(true); // Show the modal after reaching the first pause point
    }
  }, [currentPauseIndex]);

  useEffect(() => {
    setVideo(
      <ReactPlayer
        url={deResult.wordcards[0].url}
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
        onEnded={() => {
          router.push("/done-lecture");
          setTimeout(() => {
            router.push("/");
          }, 3000);
        }}
        className=" bg-dark-1 overflow-hidden"
      />
    );
  }, [isPlaying, currentPauseIndex]);

  // TODO: the first Modal is rendering when the video start, How can I fix this?
  return (
    <section className="relative">
      <h1 className="head-text text-left">안녕! {deUserInfo.username}</h1>
      {/* ReactPlayer component with pause logic */}
      <div className="relative h-[45rem] w-full">{video}</div>
      {showModal && (
        <Modal>
          <div>
            {deResult?.wordcards?.map(
              (wordcard: WordCard, index: number) =>
                index === currentWordCardIndex && (
                  <WordCard
                    index={index}
                    key={wordcard._id}
                    id={wordcard._id}
                    url={wordcard.url}
                    kind={wordcard.kind}
                    smallTitle={wordcard.smallTitle}
                    korean={wordcard.korean}
                    english={wordcard.english}
                    cardNumber={wordcard.cardNumber}
                    currentUserId={deUserInfo?.id || ""}
                  />
                )
            )}
            <button onClick={handleNext}>Done</button>
          </div>
        </Modal>
      )}
    </section>
  );
}
