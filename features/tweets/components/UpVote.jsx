"use client"

import { typography } from '@/shared/styles/globalN'
import { ThumbsUp } from 'lucide-react'
import React from 'react'

const UpVote = ({ onUpvoteClick, votes, fill = false }) => {
  return (
    <section className={`flex items-center ${typography.caption} cursor-pointer hover:text-black`} onClick={onUpvoteClick}>
        <ThumbsUp className={`w-4 h-4 text-gray-500 ${fill ? 'fill-black' : ''} hover:fill-black`}/>
        <span className="ml-1 text-gray-500">{votes || 0}</span>
    </section>
  )
}

export default UpVote