'use client'
import React, { useEffect } from 'react'
import { z } from '../styles/globalN'
import Link from 'next/link'
import { Bell, Home, LogOutIcon, MessageCircle, Search, User, UserRoundPlus } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import { useNotification } from '@/features/notification/contexts/NotificationContext'



const SideBar = () => {
    const {data: session, status} = useSession();
    const pathname = usePathname();
    const router = useRouter();
    const { notifications } = useNotification();
    const userId = session?.user?.name?.id || "";

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

    },[status, session]);

    
    //if authenticated and session is fully loaded.
    const navLinks = [
        {name: "Home", link : "/", icon: Home},
        // {name: "Explore", link : "/explore",icon:Search},
        {name: "Notification", link : `/notification`,icon: Bell},
        // {name: "Follow", link : "/follow",icon: UserRoundPlus},
        // {name: "Chat", link : "/chat",icon: MessageCircle },
        {name: "Profile", link : "/user-profile",icon: User},
        {name: "Logout", link : "",icon: LogOutIcon, onClick: () =>  signOut({redirectTo: "/auth"})},
    ];

  return (
    <aside className={`hidden sm:block h-[calc(100vh-4rem)] p-4 border-r border-gray-300 left-0 top-16 sticky ${z.sticky} md:w-38`}>
        <nav>
            <ul className='space-y-2'>
                {
                    navLinks.map((navLink) => {
                        const isActiveMenu = navLink.link === pathname;
                        const MenuIcon = navLink.icon;
                        return (<li key={navLink.name} onClick={navLink?.onClick}>
                            <Link href={navLink.link === '/notification' ? `/notification?forUserId=${userId}`: navLink.link} className={`flex items-start gap-2 py-1 text-gray-700 hover:font-bold ${ isActiveMenu && 'font-bold'}`}>
                                <MenuIcon className= {`${isActiveMenu && 'fill-black'} hover:fill-black`}/>
                                <span className='hidden md:inline'>{navLink.name}</span>
                            </Link>
                        </li>
                        )
                    })
                }
            </ul>
        </nav>
        {
         notifications.length !== 0 && 
                <span className='absolute text-[9px] text-white py-0.5 px-1 bg-blue-500 rounded-full ml-3 -mt-28 items-center'>
                  {notifications.length}
            </span>
        }
            
    </aside>
  )
}

export default SideBar