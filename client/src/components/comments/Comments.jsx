import React from 'react'
import styles from "./comments.module.css"
import Comment from './Comment'
import axios from 'axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth, useUser } from '@clerk/clerk-react'
import { toast } from 'react-toastify'


const fetchComments = async (postId) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/comments/${postId}`);
    console.log("comments::", res.data)
    return res.data;
}


const Comments = ({ postId }) => {
    const { user } = useUser();
    const { getToken } = useAuth();
    const queryClient = useQueryClient();

    // query to fetch comments
    const { isPending, data, error } = useQuery({
        queryKey: ["comments", postId],
        queryFn: () => fetchComments(postId),
    })


    //mutation to add,delete comments 
    const mutation = useMutation({
        mutationFn: async (newComment) => {
            console.log("comment mutation hit")
            const token = await getToken()
            return axios.post(`${import.meta.env.VITE_API_URL}/comments/${postId}`, newComment, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: (res) => {
            console.log("comment mutation res::", res)
            queryClient.invalidateQueries({ queryKey: ["comments", postId] })
        },
        onError: (error) => {
            console.log("error on comment mutations")
            toast.error(error.response.data)
        }

    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("post comment initiated!!")
        const formData = new FormData(e.target)
        const desc = formData.get("desc")

        if (desc.trim() == "") {
            alert("cant post empty comments");
            return;
        }

        const data = {
            desc
        }
        console.log("comment to be added ::", data)
        mutation.mutate(data)
    }


    return (
        <div className={styles.container}>
            <h1>Comments</h1>
            <form onSubmit={handleSubmit} className={styles.commentText}>
                <textarea name="desc" id="comment" placeholder='Write a comment...' />
                <button>Send</button>
            </form>
            {
                isPending
                    ? "Loading Comments... "
                    : error
                        ? "error loading comments"
                        : (
                            <>
                                {mutation.isPending && (
                                    <Comment
                                        comment={{
                                            desc: `${mutation.variables.desc} (Sending...)`,
                                            createdAt: new Date(),
                                            user: {
                                                username: user.username,
                                            }
                                        }}
                                    />
                                )}


                                {data.map((comment) => (
                                    <Comment key={comment._id} comment={comment} postId={postId} />))}
                            </>
                        )
            }
        </div>

    )
}

export default Comments