'use client'

import { TweetProvider } from '@/features/tweets/contexts/TweetContext'
import { SessionProvider } from 'next-auth/react'
import React from 'react'
import { SideBarProvider } from '../contexts/SideBarContext'


const Providers = ({children}) => {
  return (
    <SessionProvider>
      <SideBarProvider>
        <TweetProvider>
          {children}
        </TweetProvider>
      </SideBarProvider>
    </SessionProvider>
  )
}

export default Providers