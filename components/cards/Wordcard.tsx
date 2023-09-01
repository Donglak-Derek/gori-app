"use client";

import { Button } from "../ui/button";
import ReactPlayer from "react-player";
// import ReactPlayer from "react-player/youtube";

import { useSpeechSynthesis } from "../hooks/useSpeechSynthesis";

interface Props {
  id: string;
  url: string;
  cardNumber: any;
  kind: string;
  smallTitle: string;
  korean: string;
  english: string;
  currentUserId: string;
  index: number;
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
  index,
}: Props) {
  const isListening = "Listening";

  return (
    <article className="wordCard">
      <div className="w-full h-94 grid grid-cols-1 grid-flow-col-dense grid-rows-6 gap-4">
        <div className="row-span-1 grid grid-cols-3 gap-1 items-center">
          <div className="text-light-1">
            {index}/{cardNumber}
          </div>
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
      </div>
    </article>
  );
}
