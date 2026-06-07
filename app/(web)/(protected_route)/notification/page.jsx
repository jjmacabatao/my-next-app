import { auth } from "@/auth";

import NotificationList from "@/features/notification/components/NotificationList";
import { redirect } from "next/navigation";

const Notification = async() => {
  const session = await auth();

    if (!session) {
      redirect('/auth');
    }

    return (
      <div className={`p-4 sm:p-5 m-auto w-full sm:w-150 mt-2 sm:mt-4`}>
          <NotificationList/>
      </div>
      
    );
};

export default Notification;