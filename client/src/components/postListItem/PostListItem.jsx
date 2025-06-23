import React from 'react'
import styles from "./postListItem.module.css"
import { Image } from "@imagekit/react"
import { Link } from "react-router-dom"
import { format } from 'timeago.js';


const PostListItem = ({ post }) => {
    return (
        <div className={styles.container}>
            {/* image */}
            {post.img && <div className={styles.imageContainer}>
                <Image
                    className={styles.image}
                    urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
                    src={post.img}
                    alt="Logo"
                    loading="lazy"
                    lqip={{ active: true, quality: 20 }}
                />
            </div>}
            {/* details */}
            <div className={styles.detailsContainer}>
                <Link to={`/${post.slug}`} className={styles.detailsTitle}>
                    {post.title}
                </Link>
                <div className={styles.detailsInfo}>
                    <span>Written by</span>
                    <Link className={styles.link} to={`/posts?author=${post.user.username}`}>{post.user.username}</Link>
                    <span>on</span>
                    <Link className={styles.link}>{post.category}</Link>
                    <span>{format(post.createdAt)}</span>
                </div>
                <p>
                    {post.desc}
                </p>
                <Link to={`/${post.slug}`} className={styles.link}>Read more</Link>
            </div>
        </div>
    )
}

export default PostListItem