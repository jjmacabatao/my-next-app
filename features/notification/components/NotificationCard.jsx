import { timeAgo } from '@/lib/utils';
import Avatar from '@/shared/components/Avatar';
import React from 'react'

const NotificationCard = ( {notification}) => {
    const {from,message, tweet, createdAt} = notification;
    const msg = message;
  return (
    
    <div className="flex gap-4 px-3 py-4 hover:border-blue-200 hover:bg-gray-50 transition-all cursor-pointer border-b border-gray-100">

                <Avatar avatarSrc={'/profile.png'} avatarAlt={'Profile Picture'} avatarWidth={40} avatarHeight={40} />

                <section className="flex-1">

                    <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{from.firstName} {from.lastName}</span>
                    <span className="text-gray-400 text-sm">@{from.username}</span>
                    <span className="rounded-full px-2 py-0.5 text-xs bg-gray-100 text-gray-500">{timeAgo(createdAt)}</span>
                    
                    </div>

                    <section className="text-gray-700 mt-1">
                        { tweet ? 
                            <p>
                                {msg} <strong>"{tweet?.body?.length > 30 ? tweet.body.substring(0,30)+'. . .' : tweet?.body}"</strong>
                            </p>
                           : 
                            <p>
                                {msg}
                            </p>
                        }
                    </section>

                    { !tweet && <span className="rounded-full px-2 py-0.5 text-[10px] bg-gray-100 text-gray-500">Post Deleted</span>}
                </section>
                {/* <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div> */}

                </div>
  )
}

export default NotificationCard