"use client"

import React from 'react'
import { useNotification } from '../contexts/NotificationContext'
import NotificationCard from './NotificationCard';
import { card } from '@/shared/styles/globalN';
import { Bell } from 'lucide-react';
import Link from 'next/link';



const NotificationList = () => {
  const {notifications, setHasOpenedNotification} = useNotification();
  
  return (
    <>
      <div className={`${card.base} ${card.padding} m-auto w-full mb-12`}>
          <div className="bg-white/90 backdrop-blur border-b border-gray-200 mb-4">
                <button className="flex py-2 text-sm  font-medium border-b-2 border-blue-500 text-black">
                    Unopened Notifications ({notifications.length})
                </button>
              
          </div>

          {/* for notifications */}
          <div className='max-h-130 overflow-y-auto'>
            {notifications.length === 0 ?
              <div className="flex flex-col items-center justify-center py-24">
                <Bell className="text-5xl mb-3" size={50}/>
                <h2 className="text-lg font-semibold">
                  No notifications yet
                </h2>
                <p className="text-gray-500 mt-2">
                  When someone interacts with your posts, you'll see it here.
                </p>
              </div>
              :
              notifications.map((notification) => 
              {
                  const notifUrl = !notification?.tweet ? 'notFound' : `${notification?.tweet?._id}?notifId=${notification._id}`;
                  return (
                    <Link key={notification._id} href={`/tweets/${notifUrl}`} onClick={()=>setHasOpenedNotification(true)}>
                        <NotificationCard  notification={notification} message={notification.message} />
                    </Link>
                  )
              }
              )
            }
          </div>

      </div>
    </>
    
  )
}

export default NotificationList