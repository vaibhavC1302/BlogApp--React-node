import React, { useState, useRef, useEffect } from 'react'
import styles from "./writePage.module.css";
import { useUser, useAuth } from "@clerk/clerk-react"
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/react";
import { v4 as uuidv4 } from 'uuid';
import { ImageKitContext } from "@imagekit/react"
// import {IKContext} from "imagekitio-react"

// authenticator function for imagekit
const authenticator = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/upload-auth`);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }
        const data = await response.json();
        const { signature, expire, token, publicKey } = data;
        return { signature, expire, token, publicKey };
    } catch (error) {
        console.error("Authentication error:", error);
        throw new Error("Authentication request failed");
    }
};


const WritePage = () => {

    const { isLoaded, isSignedIn } = useUser();
    const { getToken } = useAuth();
    const [value, setValue] = useState()
    const navigate = useNavigate()
    const [cover, setCover] = useState(null)
    const [progress, setProgress] = useState(0);
    const [contentImg, setContentImg] = useState(null)
    const CoverFileInputRef = useRef(null);
    const contentImgFileInputRef = useRef(null)
    const abortController = new AbortController();

    useEffect(() => {
        contentImg && setValue(prev => prev + `<image src = "${contentImg.url}"/>`)
    }, [contentImg])


    // mutation to create a new post 
    const mutation = useMutation({
        mutationFn: async (newPost) => {
            console.log("mutation hit")
            const token = await getToken()
            return axios.post(`${import.meta.env.VITE_API_URL}/posts`, newPost, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        },
        onSuccess: (res) => {
            toast.success("Post has been created!")
            navigate(`/${res.data.slug}`)
        }
    });

    if (!isLoaded) {
        return (
            <div>Loading ...</div>
        )
    }

    if (isLoaded && !isSignedIn) {
        return (<div>You should sign in first.</div>)
    }

    // funciton to handle form submission
    const handleSubmit = (e) => {
        console.log("form submission initiated")
        e.preventDefault();

        const isEmpty = !value || value.replace(/<(.|\n)*?>/g, '').trim().length === 0;
        if (isEmpty) {
            alert("Content can't be empty.")
            return
        }

        console.log("form submit clicked")


        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData)
        const newPost = {
            img: cover?.filePath || "",
            content: value,
            ...data
        }
        console.log("new post to be sent ::", newPost)
        mutation.mutate(newPost);
    }

    // generate a unique file name
    const generateUniqueFileName = (fileName) => {
        const extension = fileName.split('.').pop();
        return `${uuidv4()}.${extension}`;
    };

    // function to handle file upload 
    const handleUpload = async (fileInputRef, setFun) => {
        console.log("handling file")
        const fileInput = fileInputRef.current;
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert("Please select a file to upload");
            return;
        }

        // Extract the first file from the file input
        const file = fileInput.files[0];

        // Retrieve authentication parameters for the upload.
        let authParams;
        try {
            authParams = await authenticator();
        } catch (authError) {
            console.error("Failed to authenticate for upload:", authError);
            return;
        }
        const { signature, expire, token, publicKey } = authParams;

        // Call the ImageKit SDK upload function with the required parameters and callbacks.
        try {
            const uploadResponse = await upload({
                // Authentication parameters
                expire,
                token,
                signature,
                publicKey,
                file,
                fileName: generateUniqueFileName(file.name),

                onProgress: (event) => {
                    setProgress((event.loaded / event.total) * 100);
                },
                abortSignal: abortController.signal,

            });
            toast.success("File uploaded")
            setFun(uploadResponse);
            console.log("content img", contentImg)

        } catch (error) {
            // Handle specific error types provided by the ImageKit SDK.
            if (error instanceof ImageKitAbortError) {
                console.error("Upload aborted:", error.reason);
            } else if (error instanceof ImageKitInvalidRequestError) {
                console.error("Invalid request:", error.message);
            } else if (error instanceof ImageKitUploadNetworkError) {
                console.error("Network error:", error.message);
            } else if (error instanceof ImageKitServerError) {
                console.error("Server error:", error.message);
            } else {
                // Handle any other errors that may occur.
                console.error("Upload error:", error);
            }
            toast.error(error.message)
        }
    };
    // setting functions 
    const setCoverImageFn = (newState) => {
        setCover(newState)
    }

    const setContentImgFn = (newState) => {
        setContentImg(newState)
    }


    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Create a New Post</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
                {/* <button className={styles.imgButton}>Add a cover picture</button> */}
                <input type="file" ref={CoverFileInputRef} />
                {/* Button to trigger the upload process */}
                <button type="button" onClick={() => handleUpload(CoverFileInputRef, setCoverImageFn)}>
                    Upload file
                </button>
                <input required name='title' className={styles.inputTitle} type="text" placeholder='My Awesome Story' />
                <div className={styles.optionsContainer}>
                    <label htmlFor="">Choose a category</label>
                    <select className={styles.selectButton} name="category" id="">
                        <option value="general">General</option>
                        <option value="web-design">Web Design</option>
                        <option value="development">Development</option>
                        <option value="databases">Databases</option>
                        <option value="seo">Search Engines</option>
                        <option value="marketing">Marketing</option>
                    </select>
                </div>
                <textarea className={styles.postContent} name="desc" id="postContent" placeholder='a short description' />
                <div className={styles.contentContainer}>
                    <div className={styles.imgBtnContainer}>
                        <div>
                            <input type="file" ref={contentImgFileInputRef} />
                            <button type='button' onClick={() => handleUpload(contentImgFileInputRef, setContentImgFn)}>img</button>
                        </div>
                    </div>
                    <ReactQuill className={styles.editor} theme='snow' value={value} onChange={setValue} />
                </div>

                <button disabled={mutation.isPending} type='submit' className={styles.sendButton}>
                    {mutation.isPending ? "Loading" : "Send"}
                </button>
                {mutation.isError && <span>{mutation.error.message}</span>}
            </form>
            Upload progress: <progress value={progress} max={100}></progress>
        </div>
    )
}

export default WritePage