import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchPosts } from "@/lib/actions/gori.actions";
import { fetchUser } from "@/lib/actions/user.actions";

export default async function page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return <div className="head-text">Guide {user.username}</div>;
}
