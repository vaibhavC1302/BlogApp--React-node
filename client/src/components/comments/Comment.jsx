import { Image } from "@imagekit/react"
import styles from "./Comment.module.css"
import React from 'react'
import { format } from "timeago.js"
import { useAuth, useUser } from "@clerk/clerk-react"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from "axios"
import { toast } from 'react-toastify'

const Comment = ({ comment, postId }) => {

    const { getToken } = useAuth();
    const { user } = useUser();
    const role = user?.publicMetadata?.role;

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: async () => {
            console.log("delete comment mutation hit")
            const token = await getToken()
            return axios.delete(`${import.meta.env.VITE_API_URL}/comments/${comment._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: () => {
            toast.success("comment deleted!")
            queryClient.invalidateQueries({ queryKey: ["comments", postId] })
        },
        onError: (error) => {
            console.log("error on comment mutations")
            toast.error(error.response.data)
        }

    });

    return (
        <div className={styles.container}>
            <div className={styles.userInfo}>
                <Image
                    className={styles.image}
                    urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
                    src="userImg.jpeg"
                    alt="Logo"
                    loading="lazy"
                    lqip={{ active: true, quality: 20 }}
                />
                <span>{comment.user.username}</span>
                <span className={styles.time}>{format(comment.createdAt)}</span>
                {user && (user.username === comment.user.username || role === "admin") && (<span className={styles.deleteCommentBtn} onClick={() => mutation.mutate()}>delete
                    {mutation.isPending && <span>(deleting .....)</span>}

                </span>)}
            </div>
            <div className={styles.content}>
                <p>
                    {comment.desc}
                </p>
            </div>
        </div>
    )
}

export default Comment