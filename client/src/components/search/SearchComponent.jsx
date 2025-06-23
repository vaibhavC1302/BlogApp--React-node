import React from 'react'
import styles from "./searchComponent.module.css"
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

const SearchComponent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();


    const handleKeyPress = (e) => {
        console.log("key pressed")
        if (e.key === "Enter") {
            const query = e.target.value;
            if (location.pathname === "/posts") {
                setSearchParams({ ...Object.fromEntries(searchParams.entries()), search: query })
            } else {
                navigate(`/posts?search=${query}`)
            }
        }
    }

    return (
        <div className={styles.container}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input id='search' type="text" placeholder='Search a post...' onKeyDown={handleKeyPress} />

        </div>
    )
}

export default SearchComponent