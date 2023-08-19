import { fetchUserGoris } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import GoriCard from "../cards/GoriCard";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

export default async function GorisTab({
  currentUserId,
  accountId,
  accountType,
}: Props) {
  let result = await fetchUserGoris(accountId);

  if (!result) redirect("/");

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.goris.map((gori: any) => (
        <GoriCard
          key={gori._id}
          id={gori._id}
          currentUserId={currentUserId}
          parentId={gori.parentId}
          content={gori.text}
          author={
            accountType === "User"
              ? {
                  name: result.name,
                  image: result.image,
                  id: result.id,
                }
              : {
                  name: gori.author.name,
                  image: gori.author.image,
                  id: gori.author.id,
                }
          }
          community={gori.community} // TODO
          createdAt={gori.createdAt}
          comments={gori.children}
        />
      ))}
    </section>
  );
}
