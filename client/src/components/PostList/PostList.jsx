import React from 'react'
// import styles from "./postList.module.css"
import PostListItem from '../postListItem/PostListItem'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from "axios"
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchParams } from 'react-router-dom';

const fetchPosts = async (pageParam, searchParams) => {

    const searchParamsObj = Object.fromEntries([...searchParams])

    console.log("searchParamsobj :::::", searchParamsObj)
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {

        params: { page: pageParam, limit: 10, ...searchParamsObj }
    })
    return res.data;
}

const PostList = () => {

    const [searchParams, setSearchParams] = useSearchParams();


    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        // status,
    } = useInfiniteQuery({
        queryKey: ['posts', searchParams.toString()],
        queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, searchParams),
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => lastPage.hasMore ? pages.length + 1 : undefined,
    })

    if (isFetching) return 'Loading...';
    if (error) return 'An error has occurred: ' + error.message;

    const allPosts = data?.pages?.flatMap((page) => page.posts) || [];

    console.log("data fetched::", data);

    return (
        <InfiniteScroll
            dataLength={allPosts.length} //This is important field to render the next data
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={<h4>Loading...</h4>}
            endMessage={
                <p style={{ textAlign: 'center' }}>
                    <b>Yay! You have seen it all</b>
                </p>
            }
        // below props only if you need pull down functionality

        >
            {allPosts.map(post => (
                <PostListItem key={post._id} post={post} />
            ))}
        </InfiniteScroll>

    )
}

export default PostList