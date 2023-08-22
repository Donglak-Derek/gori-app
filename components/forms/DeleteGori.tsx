"use client";

import { deleteGori } from "@/lib/actions/gori.actions";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { threadId } from "worker_threads";

interface Props {
  goriId: string;
  currentUserId: string;
  authorId: string;
  parentId: string | null;
  isComment?: boolean;
}

export default function DeleteGori({
  goriId,
  currentUserId,
  authorId,
  parentId,
  isComment,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  if (currentUserId !== authorId || pathname === "/") return null;

  return (
    <Image
      src="/assets/delete.svg"
      alt="delete"
      width={18}
      height={18}
      className="cursor-pointer object-contain"
      onClick={async () => {
        await deleteGori(JSON.parse(goriId), pathname);
        if (!parentId || !isComment) {
          router.push("/");
        }
      }}
    />
  );
}
