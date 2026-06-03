"use client"

import Header from '@/shared/components/Header'
import SideBar from '@/shared/components/SideBar'
import { usePathname } from 'next/navigation'
import React from 'react'


//A client side component use for conditional layout rendering
const LayoutWrapper = ( {children} ) => {
    const pathname = usePathname();
  return (
    <>
        {pathname !== "/auth" && <Header />}
          <div className="flex">
            {pathname !== "/auth" && <SideBar />}
            <main className="flex-1"> {children}</main>
          </div>
    </>
  )
}

export default LayoutWrapper