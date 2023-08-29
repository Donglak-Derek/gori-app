import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import { fetchUser } from "@/lib/actions/user.actions";

import { fetchClasseById } from "@/lib/actions/course.actions";
import WordCard from "@/components/cards/WordCard";

export const revalidate = 0;

export default async function page({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  // current Course
  const result = await fetchClasseById(params.id);

  return (
    <section className="relative">
      <div>
        <>
          {result.wordcards.map((wordcard: any, index: number) => (
            <WordCard
              key={JSON.stringify(wordcard._id)}
              id={JSON.stringify(wordcard._id)}
              kind={JSON.stringify(wordcard.kind)}
              smallTitle={JSON.stringify(wordcard.smallTitle)}
              korean={JSON.stringify(wordcard.korean)}
              english={JSON.stringify(wordcard.english)}
              cardNumber={JSON.stringify(wordcard.cardNumber)}
              currentUserId={user?.id || ""}
            />
          ))}
        </>
      </div>
    </section>
  );
}
