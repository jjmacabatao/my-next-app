"use client"

import { typography } from '@/shared/styles/globalN'
import { ThumbsUp } from 'lucide-react'
import React from 'react'

const UpVote = ({ onUpvoteClick, votes, fill = false, active = false }) => {
  return (
    <section className={`flex items-center ${typography.caption} cursor-pointer hover:text-black ${active && 'text-blue-500 border-b-3 font-medium border-blue-500 transition-all'}`} onClick={onUpvoteClick}>
        <ThumbsUp className={`w-4 h-4 text-gray-500 ${fill ? 'fill-black' : ''} hover:fill-black`}/>
        <span className="ml-1 text-gray-500">{votes || 0}</span>
    </section>
  )
}

export default UpVote
