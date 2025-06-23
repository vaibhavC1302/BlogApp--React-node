import React from 'react'
import styles from "./mainCategories.module.css"
import { Link } from 'react-router-dom'
import SearchComponent from '../search/SearchComponent'
const MainCategories = () => {
    return (
        <div className={styles.container}>
            {/* links */}
            <div className={styles.linksContainer}>
                <Link className={`${styles.link} ${styles.active}`} to="/posts">
                    All Posts
                </Link>
                <Link className={styles.link} to="/posts?cat=web-design">
                    Web Design
                </Link>
                <Link className={styles.link} to="/posts?cat=development">
                    Development
                </Link>
                <Link className={styles.link} to="/posts?cat=database">
                    Database
                </Link>
                <Link className={styles.link} to="/posts?cat=seo">
                    Search Engines
                </Link>
                <Link className={styles.link} to="/posts?cat=marketing">
                    Marketing
                </Link>
            </div>
            {/* divider */}
            <span className={styles.divider}>|</span>
            {/* search */}
            <div className={styles.searchBox}>
                <SearchComponent />
            </div>
        </div>
    )
}

export default MainCategories