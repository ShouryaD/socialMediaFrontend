import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useSelector } from 'react-redux';
import { Button, Modal } from 'antd';
import { toast } from 'react-toastify';

export default function HomeCopy() {
    let [post, setPost] = useState([])
    let [comment, setComment] = useState('')
    let sliceData = useSelector((state) => state.user)
    console.log(sliceData.user)
    console.log(comment)
    async function getAllUser() {
        let res = await axios.get('http://localhost:3000/posts/getAll')
        console.log(res.data)
        setPost(res.data.data)
    }

    let userDetails = useSelector((state) => state.user)
    console.log(userDetails.user.userDetails)

    useEffect(() => {
        getAllUser()
        console.log(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME)
        // if (userDetails.foundUser) {
        //   setFoundUser(userDetails?.foundUser.user)
        // }
    }, [, userDetails])

    let handleLike = async (id) => {
        console.log(id)
        let res = await axios.post(`http://localhost:3000/posts/like/${id}`, { id }, {
            headers: {
                'Authorization': sliceData.token
            }
        })
        console.log(res)
        if (res.data.success) {
            getAllUser()
        }
    }

    let handleComment = async (id) => {
        let res = await axios.post(`http://localhost:3000/posts/comment/${id}`, { text: comment }, {
            headers: {
                'Authorization': userDetails.token
            }
        })
        console.log(res.data)
        setComment('')
        if (res.data.success) {
            toast.success('Comment Added Successfully', {
                position: 'bottom-right',
                theme: 'dark'
            })
            getAllUser()
        }
    }

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

    const [selectedObj, setSelectedObj] = useState('')
    const getObj = (obj) => {
        console.log(obj)
        setSelectedObj(obj)
    }

    const [currentIndexes, setCurrentIndexes] = useState(post?.map(() => 0));
    const previousSlide = () => {
        setCurrentIndexes((prevIndexes) => prevIndexes.map((index, postIndex) => index === 0 ? posts[postIndex].media.length - 1 : index - 1));
    };
    const nextSlide = () => {
        setCurrentIndexes((prevIndexes) => prevIndexes.map((index, postIndex) => index === posts[postIndex].media.length - 1 ? 0 : index + 1));
    };
    return (
        <>
            <div className='h-full flex items-around z-0'>
                <div className='w-1/6'>
                    <Sidebar getAll={getAllUser} />
                </div>
                <div className='h-full w-4/6 flex justify-center items-center mt-24'>
                    <div className="w-auto h-auto flex-col justify-center items-center ">
                        {post.map((ele, key) => (
                            <div className="max-w-xs container bg-white shadow-lg transform transition duration-500" key={key} onClick={() => getObj(ele)}>
                                <div>
                                    {/* <span className="text-white text-xs font-bold rounded-lg bg-green-500 inline-block mt-4 ml-4 py-1.5 px-4 cursor-pointer">Home</span> */}
                                    <h1 className="text-2xl mt-2 ml-4 font-bold text-gray-800 cursor-pointer hover:text-gray-900 transition duration-100">{ele.title}</h1>
                                    <p className="ml-4 mt-1 mb-2 text-gray-700 hover:underline cursor-pointer">#by {ele.userId.name}</p>
                                </div>
                                {/* <div className=''>
                                    <Swiper
                                        className='h-auto'
                                        spaceBetween={50}
                                        slidesPerView={1}
                                        onSlideChange={() => console.log('slide change')}
                                    // onSwiper={(swiper) => console.log(swiper)}
                                    >
                                        {ele.files.map((ele, key) => (
                                            ele.resource_type === 'image' ?
                                                <SwiperSlide key={key}><img src={ele.url} alt="" /></SwiperSlide> :
                                                <SwiperSlide key={key}>
                                                    <video controls autoPlay src={ele.url} />
                                                </SwiperSlide>
                                        ))}

                                    </Swiper>

                                </div> */}
                                <div className="relative w-full max-w-xl mx-auto">
                                    {ele.files.map((post, postIndex) => (
                                        <div key={post.id} className="mb-4">
                                            <div className="overflow-hidden rounded-lg shadow-lg">

                                                <div key={postIndex} className={`w-full transition-transform duration-500 ${postIndex === currentIndexes[postIndex] ? 'block' : 'hidden'}`} >
                                                    {post.resource_type === 'image' ?
                                                        (<img src={post.url} alt={post.alt} className="w-full" />)
                                                        : (<video src={post.url} controls className="w-full" />)}
                                                </div>

                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={previousSlide} className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-r-lg" > &lt; </button>
                                    <button onClick={nextSlide} className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-l-lg" > &gt; </button>
                                </div>
                                <div className='h-12'>
                                    {/* {ele.files.map((ele, key) => (
                  <div key={key}> {ele.resource_type === 'image' ?
                    <img className="w-full cursor-pointer h-[40vh] object-contain" src={ele.url} alt="" /> :
                    <video className="w-full cursor-pointer h-[40vh] object-contain" autoPlay src={ele.url} controls />}
                  </div>
                ))} */}
                                    <input type="text" className='border rounded mt-2 w-auto py-2 m-auto mr-2' placeholder='comment' name="" id="" onChange={(e) => setComment(e.target.value)} value={selectedObj._id === ele._id ? comment : ''} />
                                    <button onClick={() => handleComment(ele._id)} className='mt-2 bg-blue-500 text-sm px-2 py-2 text-white w-1/4 m-auto rounded'>Comment</button>

                                </div>
                                <div className="flex p-4 justify-between">
                                    <div className="flex items-center space-x-2">
                                        <img className="w-10 rounded-full" src={ele.userId.profilePic} alt="sara" />
                                        <h2 className="text-gray-800 font-bold cursor-pointer">{ele.userId.name}</h2>
                                    </div>
                                    <div className="flex space-x-2">
                                        <div className="flex space-x-1 items-center">
                                            <span onClick={showModal}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-600 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                            </span>
                                            <span>{ele.comments.length}</span>
                                        </div>
                                        <div className="flex space-x-1 items-center">
                                            <span>
                                                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => handleLike(ele._id)} className={ele.likes.includes(userDetails?.user?.userDetails?._id) ? "h-7 w-7 text-red-500 hover:text-red-400 transition duration-100 cursor-pointer" : "h-7 w-7 text-slate-600 border transition duration-100 cursor-pointer"} viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                            <span>{ele.likes.length}</span>
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
                                    <div className="flex-col mt-1">
                                        <div className="flex items-center flex-1 px-4 font-bold leading-tight">{ele.userId.name}
                                            <span className="ml-2 text-xs font-normal text-gray-500">2 weeks ago</span>
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
            {/* <div>
        <div className={foundUser.length > 0 ? 'flex flex-col gap-4 h-52 overflow-y-auto w-[14vw] bg-red-400 p-5 absolute right-[44vw] top-16 rounded-md mt-2' : 'none'}>
          <h1 className='text-end cursor-pointer' onClick={()=>setFoundUser([])}>X</h1>
          {foundUser?.map((ele) => (
            <div className='flex h-10 w-20 gap-4 items-center'>
              <img src={ele.profilePic} className='rounded-full h-10' alt="" />
              <div>
              <h2>{ele.name}</h2>
              <h2 className='text-sm'>{ele.email}</h2>
              </div>
            </div>
          ))}
        </div>
      </div> */}
        </>
    )
}
