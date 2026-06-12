"use client"

import { GET_USER_TWEETS_AND_COMMENT, timeAgo } from '@/lib/utils'
import Avatar from '@/shared/components/Avatar'
import { layout, typography } from '@/shared/styles/globalN'
import { Trash2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

const CommentCard = ( {comment, onDelete, withDeleleFn = true} ) => {
    const {data:session, status} = useSession();
    const pathname = usePathname();
    const router = useRouter();

    // return if session is not yet loaded
    if (status === "loading") {
        return;
    }
    // router push to /auth if not authenticated
    if (status === "unauthenticated") {
        router.push("/auth");
        return;
    }

  return (
     <section className='flex flex-col justify-self-start w-full p-2 border-b border-gray-200'>
        <section className={`flex gap-3 mt-2`}>
            <Avatar avatarSrc={'/profile.png'} avatarAlt={'Profile Picture'} avatarWidth={30} avatarHeight={30} />
            <div className='w-full flex flex-row items-center justify-between'>
                <section className={`${layout.inline}`}>
                    {
                        pathname === '/user-profile' ?
                        <h3 className="text-md font-semibold">
                            {comment.comment_by.firstName} {comment.comment_by.lastName}
                        </h3> :
                        <Link href={`/user-profile?userId=${comment.comment_by._id}&action=${GET_USER_TWEETS_AND_COMMENT}`} className='text-md font-semibold hover:underline'>
                            {comment.comment_by.firstName} {comment.comment_by.lastName}
                        </Link>
                    }
                    
                    <span className="text-gray-400 text-sm">
                    @{comment.comment_by.username}
                    </span>

                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700">
                        {timeAgo(comment.createdAt)}
                    </span>
                    
                </section>
                {
                    (session?.user?.name?.id === comment.comment_by._id && withDeleleFn) && <Trash2 size={13} className="text-gray-500 cursor-pointer transition-all hover:fill-black" onClick={onDelete}/>
                }
                
            </div>
            
        </section>
        <section className={`${typography.body} pl-10 pr-3 wrap-break-word`}>
            <p>{comment.comment}</p>
        </section>
    </section>
  )
}

export default CommentCard