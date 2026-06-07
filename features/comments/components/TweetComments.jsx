
import { button, card, input, layout, text } from '@/shared/styles/globalN'
import React, { useState } from 'react'
import CommentCard from './CommentCard'
import { createComment, deleteComment } from '@/features/comments/services/comment.api.server.service';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import showAlert from '@/lib/alert';
import { createNotification } from '@/features/notification/services/notif.api.client.service';


const TweetComments = ( { tweetId, comments, tweetAuthor } ) => {
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

    //function that handles comment creation
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

            // create notification
            if (userId !== tweetAuthor) {
                await createNotification(tweetId,userId,tweetAuthor,`commented on your post.`);
            }

            setLoading(false);

            showAlert("success","Comment successfully posted");
            
            // console.log(response.newComment);
            // console.log("Notification state: ",notification);

        } catch (error) {
            setError("[Catch]Create comment error: ", error.message)
        }finally {
            setLoading(false);
            router.refresh();
        }
    }

    //function that handles comment deletion
    const handleDeleteComment = async (commentId) => {
        try {
            const deleteCommentResponse = await deleteComment(commentId);

            if (!deleteCommentResponse.success){
                showAlert("danger",deleteCommentResponse.error);
                return;
            }
            
            const userId = session.user?.name?.id;
            // create notification
            if(userId !== tweetAuthor) {
                await createNotification(tweetId,userId,tweetAuthor,`deleted a comment on your post.`);
            }
            
            showAlert("success", deleteCommentResponse.message);

        } catch (error) {
            showAlert("danger", error.message);
        }finally {
            router.refresh();
        }
    }

  return (
    <section className={`flex flex-col justify-self-start ${layout.between} ${card.footer} border-t border-gray-200 pt-3 w-full`}>
        
        <div className={`w-full min-h-5 max-h-100 overflow-y-auto`}>

            {
                commentLen > 0 ?
                    comments.map((comment) => (
                            <CommentCard key={comment._id} comment={comment} onDelete={()=>handleDeleteComment(comment._id)}/>
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