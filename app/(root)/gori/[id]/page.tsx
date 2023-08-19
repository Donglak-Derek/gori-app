import GoriCard from "@/components/cards/GoriCard";
import { fetchGoriById } from "@/lib/actions/gori.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

// 3: 16
export default async function page({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  // current Gori
  const gori = await fetchGoriById(params.id);

  return (
    <section>
      <div>
        <GoriCard
          key={gori._id}
          id={gori._id}
          currentUserId={user?.id || ""}
          parentId={gori.parentId}
          content={gori.text}
          author={gori.author}
          community={gori.community}
          createdAt={gori.createdAt}
          comments={gori.children}
        />
      </div>
    </section>
  );
}
