import Avatar from '@/shared/components/Avatar'
import { button, typography } from '@/shared/styles/globalN'
import React from 'react'

const TweetCommentsModal = ( {closeModal, data} ) => {
  return (
    <div className='fixed top-0 left-0 w-full h-full bg-gray-100 flex justify-center items-center z-50 bg-opacity-15 '>
          <div className='bg-white shadow-lg rounded-md p-5 w-120 m-4'>
            <section className={`flex gap-3`}>
                <Avatar avatarSrc={'/profile.png'} avatarAlt={'Profile Picture'} avatarWidth={50} avatarHeight={50} />
    
                <section className="flex-1">
                    <h3 className="text-md font-semibold">
                        {data.author.firstName} {data.author.lastName}
                    </h3>
                    <span className="text-gray-400 text-sm">
                        @{data.author.username}
                    </span>
        
                    <span className="text-gray-500 text-sm">
                        · {new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {new Date(data.createdAt).toLocaleDateString()}
                    </span>
                </section>
            </section>
            <div className='py-4'>
              <section className={`mt-5 ${typography.body}`}>
                <p>{data.body}</p>
              </section>
            </div>

            <div className='border-t border-gray-300 flex justify-end items-center gap-4 pt-3'>
              
              <button
                type='button'
                className={`${button.base} ${button.variants.solid} ${button.sizes.md}`}
              >
                Save Changes
              </button>
              <button
                type='button'
                className={`${button.base} ${button.variants.solid} ${button.sizes.md}`}
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
  )
}

export default TweetCommentsModal