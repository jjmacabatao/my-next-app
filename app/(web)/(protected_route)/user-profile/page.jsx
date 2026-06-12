import { auth } from "@/auth";
import UserProfile from "@/features/user-profile/components/UserProfile";
import { API_USER_BASE_URL } from "@/lib/utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const Profile = async ({searchParams}) => {
  const session = await auth();

  if (!session) {
    redirect("/auth");
  }

  const { userId } = await searchParams;
  const currentUser = session?.user?.name?.id;
  const profileUserId = userId || currentUser;
  
  const getUserTweetAndComments = async () => {
    try {
      const cookiesStore = await cookies();
      const responseGetUserTweetAndComment = await fetch(`${API_USER_BASE_URL}?userId=${profileUserId}&action=getUserTweetsAndComments`, {
        headers: {
          Cookie: cookiesStore.toString(),
        }
        });
      
      if (!responseGetUserTweetAndComment.ok) {
        console.error("Failed to load user's tweets and comments");
      }

      const data = await responseGetUserTweetAndComment.json();

      if(!data.success) {
        console.error(data.error);
      }

      return data;
    } catch (error) {
      console.error("[Catch] getUserTweetAndComments error: ", error.message);
    }
    
  }
  
  const userTweetsAndComments = await getUserTweetAndComments();

  return (
    <UserProfile userData={userTweetsAndComments} currentUser={currentUser}/>
  );
};

export default Profile;
