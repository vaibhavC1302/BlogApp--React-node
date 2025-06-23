import React from 'react'
import { Link } from "react-router-dom"
import styles from "./homePage.module.css"
import MainCategories from '../../components/mainCategories/MainCategories'
import FeaturedPosts from '../../components/featuredPosts/FeaturedPosts'
import PostList from "../../components/PostList/PostList"

const HomePage = () => {
    return (
        <div className={styles.mainContainer}>
            {/* breadcrumbs */}
            <div className={styles.breadcrumbs}>
                <Link to="/">Home</Link>
                <span>•</span>
                <span>Blogs and Articles</span>
            </div>

            {/* introduction */}
            <div className={styles.introduction}>
                {/* titles */}
                <div className="title">
                    <h1 className={styles.titleHeading}>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    </h1>
                    <p className={styles.titleContent}>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab totam quo ducimus maiores, asperiores modi quidem vero.
                    </p>
                </div>
                {/* animated button */}
                <Link to="/write" className={styles.animatedButton}>
                    <svg
                        viewBox='0 0 200 200'
                        width="200"
                        height={200}
                    >
                        <path
                            fill='none'
                            id="circlePath"
                            d="M 100, 100 m -75, 0 a 75, 75 0 1,1 150, 0 a 75, 75 0 1, 1 -150, 0" />
                        <text>
                            <textPath href='#circlePath' startOffset="0%">Write your story •</textPath>
                            <textPath href='#circlePath' startOffset="50%">Share your ideas •</textPath>

                        </text>
                    </svg>

                    <button className={styles.arrowCircle}>  <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="50"
                        height="50"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                    >
                        <line x1="6" y1="18" x2="18" y2="6" />
                        <polyline points="9 6 18 6 18 15" />
                    </svg></button>

                </Link>
            </div>

            {/* main  categories */}
            <MainCategories />

            {/* featured posts */}
            <FeaturedPosts />

            {/* postlists */}
            <PostList />

        </div>
    )
}

export default HomePage