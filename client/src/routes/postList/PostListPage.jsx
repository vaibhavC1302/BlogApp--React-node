import React, { useState } from 'react'
import PostList from "../../components/PostList/PostList"
import SideMenu from '../../components/sideMenu/SideMenu'
import styles from "./postListPage.module.css"

const PostListPage = () => {

    const [open, setOpen] = useState(false)

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Development Blog</h1>
            <button onClick={() => { setOpen(prev => !prev) }} className={styles.menuBtn}>
                {open ? "Close" : "Filter or Search"}
            </button>
            <div className={styles.contentContainer}>
                <div>
                    <PostList />
                </div>
                {/* fix this */}
                <div className={`${open ? styles.block : styles.none} ${styles.sideMenuContainer}`}>
                    <SideMenu />
                </div>
            </div>

        </div>
    )
}

export default PostListPage