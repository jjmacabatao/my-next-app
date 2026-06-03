import React from 'react'
import Avatar from './Avatar'
import { timeAgo } from '@/lib/utils'

const UserCard = ({ viewer }) => {
  return (
        <section className={`flex gap-2 p-2 items-center border-b border-gray-200`}>
          <Avatar avatarSrc={'/profile.png'} avatarAlt={'Profile Picture'} avatarWidth={30} avatarHeight={30} />

            <h3 className="text-sm">
              {/* {tweet.author.firstName} {tweet.author.lastName} */}
              Joseph Jake C. Macabatao
            </h3>
            <span className="text-gray-400 text-xs">
              {/* @{tweet.author.username} */}
              @jsphjk
            </span>
            <span className="rounded-full px-2 py-0.5 text-xs bg-gray-100 text-gray-5 00">
              2m
            </span>
        </section>
        
  )
}

export default UserCard