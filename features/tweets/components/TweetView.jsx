import { typography } from '@/shared/styles/globalN'
import { Eye } from 'lucide-react'
import React from 'react'

const TweetView = ({ views }) => {
  return (
    <span className={`flex items-center ${typography.caption} cursor-pointer hover:text-black`}>
          <Eye className="w-4 h-4 text-gray-500 hover:fill-black"/>
          <span className="ml-1 text-gray-500">{views || 0}</span>
        </span>
  )
}

export default TweetView