"use client"

import React from 'react'
import Avatar from './Avatar'
import { timeAgo } from '@/lib/utils'

const UserCard = ({ user }) => {
  const userData = user.user_id?.firstName ? user.user_id : user.reaction_by
  return (
        <section className={`flex gap-2 p-2 items-center border-b border-gray-200`}>
          <Avatar avatarSrc={'/profile.png'} avatarAlt={'Profile Picture'} avatarWidth={30} avatarHeight={30} />

            <h3 className="text-sm font-medium">
              {userData.firstName} {userData.lastName}
            </h3>
            <span className="text-gray-400 text-xs">
              @{userData.username}
            </span>
            <span className="rounded-full px-2 py-0.5 text-xs bg-gray-100 text-gray-5 00">
              {timeAgo(user.createdAt)}
            </span>
        </section>
        
  )
}

export default UserCard