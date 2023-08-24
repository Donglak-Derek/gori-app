import Image from "next/image";
import Link from "next/link";

import { formatDateString } from "@/lib/utils";
import DeleteGori from "../forms/DeleteGori";

interface Props {
  id: string;
  cardNumber: number;
  kind: string;
  smallTitle: string;
  korean: string;
  english: string;
  currentUserId: string;
}

export default function GoriCard({
  id,
  cardNumber,
  kind,
  smallTitle,
  korean,
  english,
  currentUserId,
}: Props) {
  return (
    <article className="flex w-full flex-col rounded-xl">
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            {id} {cardNumber}
            <div className="gori-card_bar" />
          </div>

          <div className="flex w-full flex-col">
            <h4 className="cursor-pointer text-base-semibold text-light-1">
              {smallTitle}
            </h4>

            <p className="text-small-regular text-light-2">{korean}</p>
            <p className="text-small-regular text-light-2">{english}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
