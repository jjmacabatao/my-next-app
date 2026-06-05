import { auth } from "@/auth";
import ViewerList from "@/features/views/component/ViewerList";
import { card, layout, surface, radius } from "@/shared/styles/globalN";
import { redirect } from "next/navigation";

const Profile = async () => {
  const session = await auth();

  if (!session) {
    redirect("/auth");
  }

  return (
    <>
      <p>Profile page - Ongoing</p>
      <section className={`${layout.section} ${surface.base} ${card.base} ${card.padding} mx-auto w-100 md:w-150`}>

        <section className="relative border min-h-50">
          <div className={`border w-30 h-30 ${radius.full} mx-auto`}>
            <span className="m-auto">Test</span>
          </div>
        </section>
      </section>
    </>
  );
};

export default Profile;
