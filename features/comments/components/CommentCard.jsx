import { timeAgo } from '@/lib/utils'
import Avatar from '@/shared/components/Avatar'
import { layout, typography } from '@/shared/styles/globalN'
import React from 'react'

const CommentCard = ( {comment} ) => {
  return (
     <section className='flex flex-col justify-self-start w-full p-2 border-b border-gray-200'>
                <section className={`flex gap-3`}>
                    <Avatar avatarSrc={'/profile.png'} avatarAlt={'Profile Picture'} avatarWidth={30} avatarHeight={30} />

                    <section className={`${layout.inline}`}>
                        <h3 className="text-md font-semibold">
                          {comment.comment_by.firstName} {comment.comment_by.lastName}
                        </h3>
                        <span className="text-gray-400 text-sm">
                        @{comment.comment_by.username}
                        </span>

                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700">
                            {timeAgo(comment.createdAt)}
                        </span>
                    </section>

                </section>
                <section className={`${typography.body} pl-10`}>
                    <p>{comment.comment}</p>
                </section>
            </section>
  )
}

export default CommentCard