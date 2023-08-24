import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import GoriCard from "@/components/cards/GoriCard";
import Pagination from "@/components/shared/Pagination";

import { fetchPosts } from "@/lib/actions/gori.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import CoursesList from "@/components/shared/CoursesList";

export default async function Home() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text text-left">
        Hi {user.username} This is Homepage.
      </h1>

      <CoursesList />
    </>
  );
}
