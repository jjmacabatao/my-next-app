'use client'
import React from 'react'
import { z } from '../styles/globalN'
import Link from 'next/link'
import { Bell, Home, LogOutIcon, MessageCircle, Search, User, UserRoundPlus } from 'lucide-react'
import { signOut } from 'next-auth/react'

const navLinks = [
    {name: "Home", link : "/", icon: <Home className='w-5 h-5' />},
    {name: "Explore", link : "/explore",icon: <Search className='w-5 h-5' />},
    {name: "Notification", link : "/notification",icon: <Bell className='w-5 h-5' />},
    {name: "Follow", link : "/follow",icon: <UserRoundPlus className='w-5 h-5' />},
    {name: "Chat", link : "/chat",icon: <MessageCircle className='w-5 h-5' />},
    {name: "Profile", link : "/user-profile",icon: <User className='w-5 h-5' />},
    {name: "Logout", link : "#",icon: <LogOutIcon className='w-5 h-5' />, onClick: () =>  signOut()},
];

const SideBar = () => {
  return (
    <aside className={`w-15 h-[calc(100vh-4rem)] p-4 border-r border-gray-300 left-0 top-16 sticky ${z.sticky} md:w-35`}>
        <nav>
            <ul className='space-y-4'>
                {
                    navLinks.map((navLink) => (
                        <li key={navLink.name} onClick={navLink?.onClick}>
                            <Link href={navLink.link} className='text-gray-700 hover:text-gray-900 flex items-start gap-1'>
                                {navLink.icon}
                                <span className='hidden md:inline'>{navLink.name}</span>
                            </Link>
                        </li>
                    ))
                }
            </ul>
        </nav>
    </aside>
  )
}

export default SideBar