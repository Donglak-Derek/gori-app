import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import PostGori from "@/components/forms/PostGori";
import { fetchUser } from "@/lib/actions/user.actions";

export default async function page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text">Create Gori</h1>

      <PostGori userId={userInfo._id} />
    </>
  );
}
