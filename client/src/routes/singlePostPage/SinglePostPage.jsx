import React from 'react'
import styles from "./SinglePostPage.module.css"
import { Image } from '@imagekit/react'
import { Link, useParams } from "react-router-dom"
import PostMenuActions from '../../components/postMenuActions/PostMenuActions'
import SearchComponent from '../../components/search/SearchComponent'
import Comments from '../../components/comments/Comments'
import axios from 'axios'
import { useQuery } from "@tanstack/react-query"
import { format } from 'timeago.js'


// function to fetch single post 
const fetchPost = async (slug) => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
    return res.data;
}

const SinglePostPage = () => {
    const { slug } = useParams();

    const { isPending, data, error } = useQuery({
        queryKey: ["post", slug],
        queryFn: () => fetchPost(slug)
    })

    if (isPending) { return "loading ..." }
    if (error) { return "something went wrong..." + error.message }
    if (!data) { return "post not found" }

    console.log("data::::", data)

    return (
        <div className={styles.container}>
            {/* <h1>singlepostpage</h1> */}
            {/* details */}
            <div className={styles.detailsContainer}>
                {/* details-text */}
                <div className={styles.detailsText}>
                    <h1 className={styles.title}>{data.title}</h1>
                    <div className={styles.smallInfo}>
                        <span>Written by</span>
                        <Link className={styles.link} >{data.user.username}</Link>
                        <span>on</span>
                        <Link className={styles.link}>{data.category}</Link>
                        <span>{format(data.createdAt)}</span>
                    </div>
                    <p className={styles.content}>{data.desc}
                    </p>
                </div>
                {/* details image */}
                {data.img && <div className={styles.imageContainer}>
                    <Image
                        className={styles.image}
                        urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
                        src={data.img}
                        alt="Logo"
                        loading="lazy"
                        lqip={{ active: true, quality: 20 }}
                    />
                </div>}

            </div>
            {/* content and side menu */}
            <div className={styles.contentContainer}>
                {/* content */}
                <div className={styles.textContent}>
                    {data.content}
                </div>
                {/* menu */}
                <div className={styles.menuContainer}>
                    <h1 className={styles.menuTitle}>Author</h1>
                    <div className={styles.menuUserInfo}>
                        <Image
                            className={styles.menuUserImg}
                            urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
                            src="userImg.jpeg"
                            alt="Logo"
                            loading="lazy"
                            lqip={{ active: true, quality: 20 }}
                        />
                        <Link>{data.user.username}</Link>
                    </div>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit.</p>

                    <div className={styles.socialIcons}>
                        <Link><Image
                            className={styles.menuUserImg}
                            urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
                            src="facebook.svg"
                            alt="facebook"
                            loading="lazy"
                            lqip={{ active: true, quality: 20 }}
                        /></Link>
                        <Link><Image
                            className={styles.menuUserImg}
                            urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
                            src="instagram.svg"
                            alt="instagram"
                            loading="lazy"
                            lqip={{ active: true, quality: 20 }}
                        /></Link>
                    </div>
                    <h1 className={styles.menuTitle}>Actions</h1>
                    <PostMenuActions post={data} />
                    <h1 className={styles.menuTitle}>Categories</h1>
                    <div className={styles.menuLinks}>
                        <Link className={styles.menuLink}>All</Link>
                        <Link className={styles.menuLink}>Web Design</Link>
                        <Link className={styles.menuLink}>Development</Link>
                        <Link className={styles.menuLink}>Database</Link>
                        <Link className={styles.menuLink}>Search Engines</Link>
                        <Link className={styles.menuLink}>Marketing</Link>
                    </div>

                    <h1 className={styles.menuTitle}>Search</h1>
                    <SearchComponent />
                </div>

            </div>
            <Comments postId={data._id} />
        </div>
    )
}

export default SinglePostPage