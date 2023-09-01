import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";

import { fetchUser } from "@/lib/actions/user.actions";

import { fetchClasseById } from "@/lib/actions/course.actions";

import WordCardsList from "@/components/shared/WordCardsList";

// export const revalidate = 0;

export default async function page({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const serializedUser = JSON.stringify(userInfo);
  // current Course
  const result: any = await fetchClasseById(params.id);
  const serializedResult = JSON.stringify(result);

  console.log(result);
  // const sanitizedUser = Object.assign({}, user, {
  //   verification: undefined,
  // });

  return (
    <section className="relative">
      <div>
        <WordCardsList user={serializedUser} result={serializedResult} />
      </div>
    </section>
  );
}
