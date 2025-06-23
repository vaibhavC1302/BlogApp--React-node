import React from 'react'
import styles from "./sideMenu.module.css"
import SearchComponent from "../../components/search/SearchComponent"
import { Link, useSearchParams } from 'react-router-dom'


const SideMenu = () => {

    const [searchParams, setSearchParams] = useSearchParams();

    const handleFilterChange = (e) => {
        if (searchParams.get("sort") !== e.target.value) {
            setSearchParams({ ...Object.fromEntries(searchParams.entries()), sort: e.target.value })
        }
    }

    const handleCategoryChange = (category) => {
        if (!searchParams.get("cat") !== category) {
            setSearchParams({
                ...Object.fromEntries(searchParams.entries()),
                cat: category
            })
        }
    }


    return (

        <div className={styles.container}>
            <h1 className={styles.title}>Search</h1>
            <SearchComponent />
            <h1 className={styles.title}>Filters</h1>
            <div className={styles.filterContainer} >
                <label htmlFor="" className={styles.label}>
                    <input name='sort' type="radio" value="newest" onChange={handleFilterChange} />
                    Newest
                </label>
                <label htmlFor="" className={styles.label}>
                    <input name='sort' type="radio" value="popular" onChange={handleFilterChange} />
                    Most popular
                </label>
                <label htmlFor="" className={styles.label}>
                    <input type="radio" name='sort' value="trending" onChange={handleFilterChange} />
                    Trending
                </label>
                <label htmlFor="" className={styles.label}>
                    <input name='sort' type="radio" value="oldest" onChange={handleFilterChange} />
                    Oldest
                </label>
            </div>
            <h1 className={styles.title}>Catrgories</h1>
            <div className={styles.linksContainer}>
                <span onClick={() => handleCategoryChange("general")}>All</span>
                <span onClick={() => handleCategoryChange("web-design")}>Web Design</span>
                <span onClick={() => handleCategoryChange("development")}>Development</span>
                <span onClick={() => handleCategoryChange("database")}>Databases</span>
                <span onClick={() => handleCategoryChange("seo")}>Search Engines</span>
                <span onClick={() => handleCategoryChange("marketing")}>Marketing</span>
            </div>
        </div>
    )
}

export default SideMenu