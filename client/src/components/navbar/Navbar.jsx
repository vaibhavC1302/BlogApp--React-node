import React, { useEffect, useState } from 'react'
import styles from "./navbar.module.css"
import { Image } from "@imagekit/react"
import { Link } from "react-router-dom"
import { SignedIn, SignedOut, SignInButton, useAuth, UserButton } from '@clerk/clerk-react';


const Navbar = () => {

    const [open, setOpen] = useState(false)

    const { getToken } = useAuth();

    useEffect(() => {
        getToken().then((token) => console.log("token::::::", token))
    }, [])

    const toggleMobileMenu = () => {
        setOpen(prev => !prev)
    }

    return (
        <div className={styles.NavbarContainer}>
            {/* logo */}
            <Link to="/" className={styles.logo}>
                <Image
                    urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
                    src="/logo.png"
                    alt="Logo"
                    loading="lazy"
                    lqip={{ active: true, quality: 20 }}
                />
                <span>lamalog</span>
            </Link>


            {/* mobile menu */}
            <div className={styles.mobileMenu}>
                <div onClick={toggleMobileMenu} className={styles.hambergerMenu}>
                    {open ? "X" : "☰"}
                </div>
                <div className={`${styles.mobileMenuList} ${open ? " " : styles.closed}`}>
                    <Link to="/">Home</Link>
                    <Link to="/">Trendong</Link>
                    <Link to="/">Most Popular</Link>
                    <Link to="/">About</Link>
                    <Link to="/"><button className={styles.loginBtn}>Login👋</button></Link>
                </div>
            </div>

            {/* desktop menu */}
            <div className={styles.desktopMenu}>
                <Link to="/">Home</Link>
                <Link to="/">Trendong</Link>
                <Link to="/">Most Popular</Link>
                <Link to="/">About</Link>
                <SignedOut>
                    <Link to="/login">
                        <button className={styles.loginBtn}>Login👋</button>
                    </Link>
                </SignedOut>
                <SignedIn >
                    <UserButton />
                </SignedIn>
            </div>
        </div>
    )
}

export default Navbar