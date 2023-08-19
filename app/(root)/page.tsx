import { fetchGoris } from "@/lib/actions/gori.actions";
import { currentUser } from "@clerk/nextjs";
import GoriCard from "@/components/cards/GoriCard";

export default async function Home() {
  const result = await fetchGoris(1, 30);
  const user = await currentUser();

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
