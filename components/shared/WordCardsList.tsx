"use client";

import React, { useState } from "react";
import WordCard from "../cards/WordCard";

import { User } from "@clerk/nextjs/server";

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

interface Props {
  user: any;
  result: any;
}

export default function WordCardsList({ user, result }: Props) {
  const [currentWordCardIndex, setCurrentWordCardIndex] = useState(0);

  const handleNext = () => {
    setCurrentWordCardIndex(currentWordCardIndex + 1);
  };

  // console.log("user!!!!!", user);
  //deserialize
  const deUserInfo = JSON.parse(user);
  const deResult = JSON.parse(result);

  return (
    <>
      <h1 className="head-text text-left">안녕! {user.username}</h1>
      <div>
        {deResult?.wordcards?.map(
          (wordcard: WordCard, index: number) =>
            index === currentWordCardIndex && (
              <WordCard
                key={wordcard._id}
                id={wordcard._id}
                url={wordcard.url}
                kind={wordcard.kind}
                smallTitle={wordcard.smallTitle}
                korean={wordcard.korean}
                english={wordcard.english}
                cardNumber={wordcard.cardNumber}
                currentUserId={deUserInfo?.id || ""}
                onNext={handleNext}
              />
            )
        )}
      </div>
    </>
  );
}
