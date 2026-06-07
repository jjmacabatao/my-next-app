'use client'
import { Bell, Home, LogOutIcon, User } from 'lucide-react';
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import React from 'react'
import { useNotification } from '@/features/notification/contexts/NotificationContext';

const FooterMenu = () => {
    const pathname = usePathname();
    const {setNotifications, notifications } = useNotification();
     const navLinks = [
        {name: "Home", link : "/", icon: Home},
        // {name: "Explore", link : "/explore",icon:Search},
        {name: "Notification", link : "/notification",icon: Bell},
        // {name: "Follow", link : "/follow",icon: UserRoundPlus},
        // {name: "Chat", link : "/chat",icon: MessageCircle },
        {name: "Profile", link : "/user-profile",icon: User},
        {name: "Logout", link : "#",icon: LogOutIcon, onClick: () =>  signOut()},
    ];
  return (
    <footer className="fixed bottom-0 w-full z-50 border-t bg-white border-gray-400 sm:hidden">
        <nav className='px-5'>
            <ul className='flex flec-row justify-between gap-2 p-2'>
                {
                    navLinks.map((navLink) => {
                        const isActiveMenu = navLink.link === pathname;
                        const MenuIcon = navLink.icon;
                        return (<li key={navLink.name} onClick={navLink?.onClick}>
                            <Link href={navLink.link} className={`flex items-start gap-2 py-1 text-gray-700 hover:font-bold  ${ isActiveMenu && 'font-bold'}`}>
                                <MenuIcon className= {`${isActiveMenu && 'fill-black'} hover:fill-black`}/>
                                <span className='hidden md:inline'>{navLink.name}</span>
                            </Link>

                            {
                                (notifications.length !== 0 && navLink.name === "Notification")  && 
                                    // for revision
                                        <div className='absolute text-[9px] font-medium text-white bg-blue-500 rounded-full text-center -mt-9 ml-2 p-0.5'>
                                        {notifications.length}
                                    </div>
                                }

                        </li>
                        )
                    })
                }
            </ul>
        </nav>
        
    </footer>
  )
}

export default FooterMenu