import React, { memo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useLocation } from 'react-router-dom';
import {  Modal } from 'antd';
import { toast } from 'react-toastify';
import { fetchUserById } from '../store/slice/UserSlice';
import Chat from '../components/Chat';
import { formatDistanceToNow } from 'date-fns';

function UserPage() {
let endpoint = import.meta.env.VITE_DEPLOYMENT == 'PRODUCTION' ? import.meta.env.VITE_ENDPOINT :'http://127.0.0.1:3000'
    let location = useLocation()
    let [userDetails, setUserDetails] = useState({ user: location.state })
    // let userDetails = { user: location.state }
    // console.log(location)
    console.log(userDetails)
    let dispatch = useDispatch()

    useEffect(() => {
        setUserDetails({ user: location.state })
    }, [location])

    let [comment, setComment] = useState('')
    const [selectedObj, setSelectedObj] = useState('')

    const getObj = (obj) => {
        // console.log(obj)
        setSelectedObj(obj)
    }

    let [posts, setPosts] = useState([])
    console.log(posts)
    let userSlice = useSelector((state) => state.user)
    // console.log(userSlice)

    const getUserPosts = async () => {
        // console.log(userDetails)
        let res = await axios.post(endpoint + `/posts/getRandomUserPost`, { userId: userDetails?.user?._id })
        // console.log(res.data)
        setPosts(res.data.posts)
    }

    let handleComment = async (id) => {
        let res = await axios.post(endpoint + `/posts/comment/${id}`, { text: comment }, {
            headers: {
                'Authorization': userSlice.token
            }
        })
        // console.log(res.data)
        setComment('')
        if (res.data.success) {
            toast.success('Comment Added Successfully', {
                position: 'bottom-right',
                theme: 'dark'
            })
            getUserPosts()
        }
    }

    useEffect(() => {
        getUserPosts()
    }, [userDetails?.user?._id])

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    let handleLike = async (id) => {
        // console.log(id)
        let res = await axios.post(endpoint + `/posts/like/${id}`, { id }, {
            headers: {
                'Authorization': userSlice.token
            }
        })
        // console.log(res)
        if (res.data.success) {
            getUserPosts()
        }
    }

    const getUserDetails = async () => {
        // console.log(userDetails.user._id)
        let res = await axios.get(endpoint +`/users/getUserById/${userDetails?.user?._id}`)
        // console.log(res.data.user)
        setUserDetails(res.data)
    }

    let originalUser = useSelector((state) => state.user)
    let token = originalUser.token
    // console.log(token)
    // console.log(originalUser.user.userDetails._id)

    useEffect(() => {
        getUserDetails()
    }, [])

    const handleFollow = async () => {
        let res = await axios.post(endpoint +`/users/follow/${userDetails.user._id}`, {}, {
            headers: {
                'Authorization': token
            }
        })
        // console.log(res.data)
        if (res.data.success) {
            getUserDetails()
            dispatch(fetchUserById(originalUser.token))
            toast.success(res.data.msg, {
                position: 'bottom-right',
                theme: 'dark'
            })
        }
        let one = originalUser?.user.userDetails.followings?.includes(userDetails?.user?._id)
        // console.log(one)
    }
    let [flag, setFlag] = useState(false)
    
    async function handleMessage() {
        setFlag(true)
        // console.log(userDetails.user._id)
        let recieverId = userDetails.user._id

        // let data = 

    }

    return (
        <div className='flex flex-col items-center bg-cyan-950 min-h-screen'>
            <div className="rounded-3xl overflow-hidden shadow-xl w-[80%] m-auto my-3 bg-cyan-900 relative">
                <img src={(userDetails?.user?.coverPic || "https://i.imgur.com/dYcYQ7E.png")} className="w-full h-60 object-cover" />

                <div className="flex justify-center -mt-8">
                    <div className='rounded-full relative w-24 h-24 -mt-3 border-solid border-white'>
                        <img src={userDetails?.user?.profilePic} className="rounded-full w-24 h-24 border-solid border-white border-2 -mt-3" />
                    </div>
                </div>
                <div className="text-center px-3 pb-6 pt-2">
                    <h3 className="text-white text-sm bold font-sans">{userDetails.user?.name}</h3>
                    <p className="mt-2 font-sans font-light text-white">{userDetails.user?.bio}</p>

                    {originalUser?.user?.userDetails?.followings?.includes(userDetails?.user?._id) ? <button className='px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white mt-3' onClick={handleFollow}>Unfollow</button>
                        :
                        <button className='px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white mt-3'
                            onClick={handleFollow}>Follow</button>}
                    <button className='px-4 py-2 bg-black text-white rounded-md ms-2 mt-3' onClick={handleMessage}>Message</button>
                </div>
                <div className="flex justify-center pb-3 text-white">
                    <div className="text-center mr-3 border-r pr-3">
                        <h2>{posts.length}</h2>
                        <span>Posts</span>
                    </div>
                    <div className="text-center mr-3 border-r pr-3">
                        <h2>{userDetails.user?.followers.length}</h2>
                        <span>Followers</span>
                    </div>
                    <div className="text-center">
                        <h2>{userDetails?.user?.followings?.length}</h2>
                        <span>Following</span>
                    </div>
                </div>
            </div>
            <div className='fixed right-0 bottom-0'>
                {flag && <Chat id={userDetails?.user} />}
            </div>
            <div className='flex justify-around mt-5 w-[80%] lg:flex-row flex-col '>
                <div className='h-auto mt-20 lg:mt-0'>
                    <div className="w-auto h-auto flex-col justify-center items-center">
                        {posts.map((ele, key) => (
                            <div className="max-w-xs container p-2 bg-slate-800 shadow-lg transform transition duration-500 rounded-md mb-3" key={key} onClick={() => getObj(ele)}>
                                <div className='mb-2'>
                                    <h1 className="text-2xl mt-2 ml-4 font-bold text-neutral-300 cursor-pointer hover:text-gray-900 transition duration-100">{ele.title}</h1>
                                    {/* <p className="ml-4 mt-1 mb-2 text-neutral-300 hover:underline cursor-pointer">#by {ele.userId.name}</p> */}
                                </div>
                                <div className=''>
                                    <Swiper
                                        className='h-auto'
                                        spaceBetween={50}
                                        slidesPerView={1}
                                    // onSlideChange={() => console.log('slide change')}
                                    // onSwiper={(swiper) => console.log(swiper)}
                                    >
                                        {ele.files.map((ele, key) => (
                                            ele.resource_type === 'image' ?
                                                <SwiperSlide key={key}><img src={ele.url} alt="" className='m-auto rounded-md' /></SwiperSlide> :
                                                <SwiperSlide key={key}>
                                                    <video controls autoPlay src={ele.url} className='w-3/4 m-auto rounded-md' />
                                                </SwiperSlide>
                                        ))}

                                    </Swiper>
                                    <div className='text-xs flex w-full justify-end my-2 '>
                                        <div className='text-neutral-300'>{formatDistanceToNow(new Date(ele.createdAt))} ago</div>
                                    </div>
                                </div>
                                <div className='h-12 flex'>
                                    <input type="text" className='border rounded mt-2 w-auto p-2 m-auto mr-2 bg-neutral-300' placeholder='comment' name="" id="" onChange={(e) => setComment(e.target.value)} value={selectedObj?._id === ele._id ? comment : ''} />
                                    <button onClick={() => handleComment(ele._id)} className='mt-2 bg-blue-500 text-sm px-2 py-2 w-1/4 m-auto rounded text-neutral-200'>Comment</button>

                                </div>
                                <div className="flex p-4 justify-between">
                                    <div className="flex items-center space-x-2">
                                        <img className="w-10 rounded-full" src={ele.userId.profilePic} alt="sara" />
                                        <h2 className="text-neutral-300 font-bold cursor-pointer">{ele.userId.name}</h2>
                                    </div>
                                    <div className="flex space-x-2">
                                        <div className="flex space-x-1 items-center">
                                            <span onClick={showModal}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-neutral-300 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                            </span>
                                            <span className='text-neutral-300'>{ele.comments.length}</span>
                                        </div>
                                        <div className="flex space-x-1 items-center">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => handleLike(ele._id)} className={ele.likes.includes(originalUser?.user?.userDetails?._id) ? "h-7 w-7 text-red-500 hover:text-red-400 transition duration-100 cursor-pointer" : "h-7 w-7 text-slate-600 border transition duration-100 cursor-pointer"} viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                                    {console.log(ele.likes.includes(userDetails?.user?._id))}
                                                </svg>
                                            </span>
                                            <span className='text-neutral-300'>{ele.likes.length}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <section className="relative flex items-center justify-center antialiased bg-white">
                    <div className="container px-0 mx-auto sm:px-5">
                        {selectedObj?.comments?.map((ele, key) => (
                            <div className="flex-col w-full py-4 mx-auto bg-white border-b-2 border-r-2 border-gray-200 sm:px-4 sm:py-4 md:px-4 sm:rounded-lg sm:shadow-sm " key={key}>
                                <div className="flex flex-row">
                                    <img className="object-cover w-12 h-12 border-2 border-gray-300 rounded-full" alt="Noob master's avatar" src={ele.userId.profilePic} />
                                    {/* {console.log(ele)} */}
                                    <div className="flex-col mt-1">
                                        <div className="flex items-center flex-1 px-4 font-bold leading-tight">{ele.userId.name}
                                            <span className="ml-2 text-xs font-normal text-gray-500">{formatDistanceToNow(new Date(ele.createdAt))} ago</span>
                                        </div>
                                        <div className="flex-1 px-2 ml-2 text-sm font-medium leading-loose text-gray-600">{ele.text}
                                        </div>
                                        <button className="inline-flex items-center px-1 pt-2 ml-1 flex-column">
                                            <svg className="w-5 h-5 ml-2 text-gray-600 cursor-pointer fill-current hover:text-gray-900" viewBox="0 0 95 78" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M29.58 0c1.53.064 2.88 1.47 2.879 3v11.31c19.841.769 34.384 8.902 41.247 20.464 7.212 12.15 5.505 27.83-6.384 40.273-.987 1.088-2.82 1.274-4.005.405-1.186-.868-1.559-2.67-.814-3.936 4.986-9.075 2.985-18.092-3.13-24.214-5.775-5.78-15.377-8.782-26.914-5.53V53.99c-.01 1.167-.769 2.294-1.848 2.744-1.08.45-2.416.195-3.253-.62L.85 30.119c-1.146-1.124-1.131-3.205.032-4.312L27.389.812c.703-.579 1.49-.703 2.19-.812zm-3.13 9.935L7.297 27.994l19.153 18.84v-7.342c-.002-1.244.856-2.442 2.034-2.844 14.307-4.882 27.323-1.394 35.145 6.437 3.985 3.989 6.581 9.143 7.355 14.715 2.14-6.959 1.157-13.902-2.441-19.964-5.89-9.92-19.251-17.684-39.089-17.684-1.573 0-3.004-1.429-3.004-3V9.936z" fillRule="nonzero" />
                                            </svg>
                                        </button>
                                        <button className="inline-flex items-center px-1 -ml-1 flex-column">
                                            <svg className="w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5">
                                                </path>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <hr className="my-2 ml-16 border-gray-200" />
                            </div>
                        ))}
                    </div>
                </section>


            </Modal>
        </div>
    )
}

export default memo(UserPage)