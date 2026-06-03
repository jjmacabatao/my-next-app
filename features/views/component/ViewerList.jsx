import UserCard from '@/shared/components/UserCard'
import { card } from '@/shared/styles/globalN'
import React from 'react'

const ViewerList = () => {
  return (
    <div className={`${card.base} w-80 m-auto mt-2`}>
        <UserCard/>
        <UserCard/>
        <UserCard/>
        <UserCard/>
        <UserCard/>
    </div>
  )
}

export default ViewerList