import React from 'react'
import styles from "./postMenuActions.module.css"
import { useAuth, useUser } from '@clerk/clerk-react'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'


const PostMenuActions = ({ post }) => {

    const { user } = useUser();
    const { getToken } = useAuth()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { isPending, error, data: savedPosts } = useQuery({
        queryKey: ["savedPosts"],
        queryFn: async () => {
            const token = await getToken();
            return axios.get(`${import.meta.env.VITE_API_URL}/users/saved`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }
    });

    console.log("saved posts: ", savedPosts)

    const isAdmin = user?.publicMetadata?.role === "admin" || false;
    const isSaved = savedPosts?.data.some((p) => p === post._id) || false;
    console.log("isSaved isAdmin isFeatured :", isSaved, isAdmin, post.isFeatured)

    const deleteMutation = useMutation({
        mutationFn: async () => {
            console.log("delete mutation hit")
            const token = await getToken();
            return axios.delete(`${import.meta.env.VITE_API_URL}/posts/${post._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: () => {
            toast.success("post deleted successfully");
            navigate("/");
        },
        onError: (error) => {
            toast.error(error.response.data)
        }
    });


    const saveMutation = useMutation({
        mutationFn: async () => {
            console.log("save mutation hit")
            const token = await getToken();
            return axios.patch(
                `${import.meta.env.VITE_API_URL}/users/save`,
                {
                    postId: post._id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["savedPosts"] })
        },
        onError: (error) => {
            toast.error(error.response.data)
        }
    })

    const featureMutation = useMutation({
        mutationFn: async () => {
            console.log("feature mutation hit")
            const token = await getToken();
            return axios.patch(
                `${import.meta.env.VITE_API_URL}/posts/feature`,
                {
                    postId: post._id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["post", post.slug] });
            toast.success("Post featured!")
        },
        onError: (error) => {
            toast.error(error.response.data)
        }
    });



    const handleDelete = () => {
        deleteMutation.mutate()
    }

    const handleFeature = () => {
        featureMutation.mutate();
    }


    const handleSave = () => {
        if (!user) {
            return navigate("/login")
        }
        saveMutation.mutate();
    }



    return (
        <div className={styles.container}>

            {isPending ? "Loading..." : error ? "error fetching saved posts"
                : <div className={styles.actionContainer} onClick={handleSave}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill={
                        saveMutation.isPending
                            ? isSaved ? "none" : "black"
                            : isSaved ? "black" : "none"}
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>Save this post</span>
                    {saveMutation.isPending && <span>saving post...</span>}
                </div>}
            {user && (user.username === post.user.username || isAdmin) &&
                (<div className={styles.actionContainer} onClick={handleDelete}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                    <span>Delete this post</span>
                    {deleteMutation.isPending && <span>deleting....</span>}
                </div>)}

            <div className={styles.actionContainer} onClick={handleFeature}>
                <svg width="24" height="24" viewBox="0 0 24 24" stroke="black" stroke-width="1.5"
                    fill={featureMutation.isPending
                        ? post.isFeatured ? "none" : "yellow"
                        : post.isFeatured ? "yellow" : "none"}
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                </svg>
                <span>Feature</span>
                {featureMutation.isPending && <span>featuring post...</span>}
            </div>
        </div>
    )
}

export default PostMenuActions