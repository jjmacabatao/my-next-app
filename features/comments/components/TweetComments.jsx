
import { button, card, input, layout, text } from '@/shared/styles/globalN'
import React, { useState } from 'react'
import CommentCard from './CommentCard'
import { createComment } from '@/features/comments/services/comment.api.client.service';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import showAlert from '@/lib/alert';

const TweetComments = ( { tweetId, comments } ) => {
    const router = useRouter();
    const commentLen = comments.length;
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const {data:session} = useSession();

    if (!session) {
        console.log("Unauthorized! Session is null.")
        return null;
    }   

    const handleCreateComment = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const userId = session.user?.name?.id;
            const response = await createComment(tweetId,userId, comment);

            if (!response.success){
                setError(response.error);
                return;
            }

            setComment("");
            setLoading(false);

            showAlert("success","Comment successfully posted");
            
            console.log(response.newComment);

        } catch (error) {
            setError("[Catch]Create comment error: ", error.message)
        }finally {
            setLoading(false);
            router.refresh();
        }
    }

  return (
    <section className={`flex flex-col justify-self-start ${layout.between} ${card.footer} border-t border-gray-200 pt-3 w-full`}>
        
        <div className={`w-full min-h-5 max-h-100 overflow-y-auto`}>

            {
                commentLen > 0 ?
                    comments.map((comment) => (
                            <CommentCard key={comment._id} comment={comment} />
                        )  
                    )
                :
                    <section>
                        <p className={`${text.primary} text-md`}>No comments yet</p>
                        <p className={`${text.muted} text-xs`}>Be the first to comment.</p>
                    </section>
                    
            }
        </div>
        
       
        <section className='flex flex-col justify-end w-full p-2'>
            <form onSubmit={handleCreateComment}>
                <textarea 
                    rows="4"
                    className={`${input.base} mt-2 w-full`} 
                    placeholder="Say something "
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}>
                </textarea>
                <button type="submit" 
                    className={`${button.base} ${button.variants.solid} ${button.sizes.md} mt-4 cursor-pointer w-full`}
                    disabled={(loading || !comment)}
                >
                    {loading ? 'Commenting . . .' : 'Comment'}
                </button>
            </form>
            
        </section>
        
    </section>
  )
}

export default TweetComments