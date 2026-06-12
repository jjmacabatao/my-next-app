import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import { getUserUnopenedNotification } from "../services/notif.api.client.service";
import { useRouter } from "next/navigation";

 const NotificationContext = createContext();

 export const NotificationProvider = ( {children} ) => {
    const router = useRouter();
    const [notifications, setNotifications] = useState([]);
    const [hasOpenedNotification, setHasOpenedNotification] = useState(false);
    const {data: session, status} = useSession();

    useEffect(() => {
        // return if session is not yet loaded
        if (status === "loading") {
            return;
        }
        // router push to /auth if not authenticated
        if (status === "unauthenticated") {
            router.push("/auth");
            return;
        }
        
        //if authenticated and session is fully loaded.
        const userId = session?.user?.name?.id || '';
        // fetch all user's unopened notifications
        const getNotification = async () => {
            try {
                
                const notification = await getUserUnopenedNotification(userId);

                if(!notification.success){
                    console.error("Failed to load user's notifications. ", notification.error);
                }else{
                    setNotifications(notification.notification);
                    setHasOpenedNotification(false);
                }
            } catch (error) {
                console.error("Failed to load user's notifications. ",error);
            }
        }

        getNotification();

    },[status, session, hasOpenedNotification]);

    const value = {
        notifications,
        setNotifications,
        setHasOpenedNotification,
    }

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    )
 }

 export const useNotification = () => {
     const context = useContext(NotificationContext);
     if (context === undefined) {
         throw new Error("useNotification must be used within a NotificationProvider");
     }
     return context;
 }
 