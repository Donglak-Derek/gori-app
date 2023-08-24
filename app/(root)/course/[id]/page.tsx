import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import { fetchUser } from "@/lib/actions/user.actions";

import { fetchClasseById } from "@/lib/actions/course.actions";
import Wordcard from "@/components/cards/Wordcard";

export const revalidate = 0;

export default async function page({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  // current Gori
  const result = await fetchClasseById(params.id);
  console.log("result!!!!!!!!!!", result);
  return (
    <section className="relative">
      <div>
        <>
          {result.wordcards.map((wordcard: any) => (
            <Wordcard
              key={wordcard._id}
              id={wordcard._id}
              kind={wordcard.kind}
              smallTitle={wordcard.smallTitle}
              korean={wordcard.korean}
              english={wordcard.english}
              currentUserId={user?.id || ""}
              cardNumber={wordcard.cardNumber}
            />
          ))}
        </>
      </div>
    </section>
  );
}
