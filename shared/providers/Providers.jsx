'use client'

import { TweetProvider } from '@/features/tweets/contexts/TweetContext'
import { SessionProvider } from 'next-auth/react'
import React from 'react'


const Providers = ({children}) => {
  return (
    <SessionProvider>
      <TweetProvider>
        {children}
      </TweetProvider>
    </SessionProvider>
  )
}

export default Providers