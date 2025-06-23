import React from 'react'
import styles from "./featuredPosts.module.css"
import { Image } from "@imagekit/react"
import { Link } from 'react-router-dom'
import axios from "axios";
import { useQuery } from "@tanstack/react-query"
import { format } from "timeago.js"


const fetchPost = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/?featured=true&limit=4&sort=newest`)
    console.log("featured posts", res.data)
    return res.data;
}

const FeaturedPosts = () => {

    const { isPending, data, error } = useQuery({
        queryKey: ["featuredPosts"],
        queryFn: () => fetchPost(),
    })

    if (isPending) return "Loading..."
    if (error) { return "something went wrong" + error.message }


    console.log("data::", data)

    const posts = data.posts;
    if (!posts || posts.length === 0) {
        console.log("no posts")
        return
    }

    console.log("POSTS:::", posts)

    return (
        <div className={styles.container}>
            {/* first--main post  */}
            <div className={styles.mainPost}>
                {posts[0]?.img && <Image
                    className={styles.mainImage}
                    urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
                    src={posts[0].img}
                    alt="Logo"
                    loading="lazy"
                    lqip={{ active: true, quality: 20 }}
                />}
                <div className={styles.details}>
                    <h1>01.</h1>
                    <Link>{posts[0]?.category}</Link>
                    <span>{format(posts[0]?.createdAt)}</span>
                </div>
                <Link
                    to={posts[0].slug}
                    className={styles.title}>
                    {posts[0]?.title}
                </Link>
            </div>

            {/* other posts- secondary posts */}
            <div className={styles.secondaryPosts}>
                {/* second */}
                {posts[1] && <div className={styles.post}>
                    {posts[1].img && <Image
                        className={styles.postImage}
                        urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
                        src={posts[1].img}
                        alt="Logo"
                        loading="lazy"
                        lqip={{ active: true, quality: 20 }}

                    />}
                    <div className={styles.postDetails}>
                        <div className={styles.postHeading}>
                            <h1>02.</h1>
                            <Link to={posts[1]?.category} className={styles.headingLink}>{posts[1]?.category}</Link>
                            <span>{format(posts[1]?.createdAt)}</span>
                        </div>
                        <Link to={posts[1].slug}>{posts[1]?.title}</Link>
                    </div>
                </div>}



                {/* third */}
                {posts[2] && <div className={styles.post}>
                    {posts[2].img && <Image
                        className={styles.postImage}
                        urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
                        src={posts[2].img}
                        alt="Logo"
                        loading="lazy"
                        lqip={{ active: true, quality: 20 }}

                    />}
                    <div className={styles.postDetails}>
                        <div className={styles.postHeading}>
                            <h1>03.</h1>
                            <Link className={styles.headingLink}>{posts[2].category}</Link>
                            <span>{format(posts[2].createdAt)}</span>
                        </div>
                        <Link to={posts[2].slug}>{posts[2].title}</Link>
                    </div>
                </div>}
                {/* forth */}
                {posts[3] && <div className={styles.post}>
                    {posts[3].img && <Image
                        className={styles.postImage}
                        urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
                        src={posts[3].img}
                        alt="Logo"
                        loading="lazy"
                        lqip={{ active: true, quality: 20 }}

                    />}
                    <div className={styles.postDetails}>
                        <div className={styles.postHeading}>
                            <h1>04.</h1>
                            <Link className={styles.headingLink}>{posts[3].category}</Link>
                            <span>{format(posts[3].createdAt)}</span>
                        </div>
                        <Link to={posts[3].slug}>{posts[3].title}</Link>
                    </div>
                </div>}


            </div>
        </div>
    )
}

export default FeaturedPosts