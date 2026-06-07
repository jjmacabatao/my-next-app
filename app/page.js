import { auth } from "@/auth";
import TweetForm from "@/features/tweets/components/TweetForm";
import TweetLists from "@/features/tweets/components/TweetLists";
import { redirect } from "next/navigation";
import React from "react";

//is a route segment configuration that forces a page or layout to be dynamically rendered on every user request.
//Milestone 5 discussion.
export const dynamic = "force-dynamic";

const HomePage = async () => {
  const session = await auth();

  if (!session) {
    redirect("/auth");
  }

  return (
    <div className={`p-4 sm:p-5 m-auto w-full sm:w-150 mt-2 sm:mt-4`}>
      <TweetForm />
      <TweetLists />
    </div>
  );
};

export default HomePage;
