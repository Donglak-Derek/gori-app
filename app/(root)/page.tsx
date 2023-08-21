import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import GoriCard from "@/components/cards/GoriCard";

import { fetchGoris } from "@/lib/actions/gori.actions";
import { fetchUser } from "@/lib/actions/user.actions";

export default async function Home() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchGoris(1, 30);
  console.log(result);

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.goris.length === 0 ? (
          <p className="no-result">No Goris found</p>
        ) : (
          <>
            {result.goris.map((gori) => (
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
            ))}
          </>
        )}
      </section>
    </>
  );
}
