'use client'

import { TweetProvider } from '@/features/tweets/contexts/TweetContext'
import { SessionProvider } from 'next-auth/react'
import React from 'react'
import { SideBarProvider } from '../contexts/SideBarContext'
import { NotificationProvider } from '@/features/notification/contexts/NotificationContext'


const Providers = ({children}) => {
  return (
    <SessionProvider>
      <NotificationProvider>
        <SideBarProvider>
          <TweetProvider>
            {children}
          </TweetProvider>
      </SideBarProvider>
      </NotificationProvider>
    </SessionProvider>
  )
}

export default Providers