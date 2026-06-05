'use client'
import React from 'react'
import { z } from '../styles/globalN'
import Link from 'next/link'
import { Bell, Home, LogOutIcon, MessageCircle, Search, User, UserRoundPlus } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'



const SideBar = () => {
    const pathname = usePathname();
    
    const navLinks = [
        {name: "Home", link : "/", icon: Home},
        {name: "Explore", link : "/explore",icon:Search},
        {name: "Notification", link : "/notification",icon: Bell},
        {name: "Follow", link : "/follow",icon: UserRoundPlus},
        {name: "Chat", link : "/chat",icon: MessageCircle },
        {name: "Profile", link : "/user-profile",icon: User},
        {name: "Logout", link : "#",icon: LogOutIcon, onClick: () =>  signOut()},
    ];

  return (
    <aside className={`w-15 h-[calc(100vh-4rem)] p-4 border-r border-gray-300 left-0 top-16 sticky ${z.sticky} md:w-38`}>
        <nav>
            <ul className='space-y-2'>
                {
                    navLinks.map((navLink) => {
                        const isActiveMenu = navLink.link === pathname;
                        const MenuIcon = navLink.icon;
                        return (<li key={navLink.name} onClick={navLink?.onClick}>
                            <Link href={navLink.link} className={`flex items-start gap-2 py-1 text-gray-700 hover:font-bold ${ isActiveMenu && 'font-bold'}`}>
                                <MenuIcon className= {`${isActiveMenu && 'fill-black'} hover:fill-black`}/>
                                <span className='hidden md:inline'>{navLink.name}</span>
                            </Link>
                        </li>
                        )
                    })
                }
            </ul>
        </nav>
    </aside>
  )
}

export default SideBar