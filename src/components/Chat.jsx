import axios from 'axios'
import React, { memo, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserById } from '../store/slice/UserSlice'
import { io } from "socket.io-client";
import ScrollToBottom from 'react-scroll-to-bottom'
import {formatDistanceToNow} from 'date-fns'

function Chat(props) {
    const Endpoint = "http://localhost:3000"
    let socketRef = useRef()
    let [message, setMessage] = useState([])
    // console.log(message)
    let [newMessage, setNewMessage] = useState('')
    let [user, setUser] = useState([])
    let [inp, setInp] = useState('')
    let [close, setClose] = useState(true)
    let dispatch = useDispatch()

    let userToken = useSelector((state) => state.user)
    // console.log(userToken.user.userDetails._id)
    // let tokenStorage = JSON.parse((localStorage.getItem('twitterLogin')))
    // console.log(tokenStorage.token)
    // console.log(props?.id?._id)

    useEffect(() => {
        if (!userToken.user) {
            dispatch(fetchUserById(userToken?.token))
            // console.log(userToken)
        }
        getMessage()
    }, [props.id._id])

    let getMessage = async () => {
        // console.log(userToken.token)
        let data = await axios.get(`http://localhost:3000/message/getMessage/${props.id._id}`, {
            headers: {
                'Authorization': userToken.token
            }
        })
        // console.log(data.data)
        if (data.data.success) {
            setMessage(data?.data?.messages?.messages)
            setUser(data?.data?.messages?.members)
            // console.log(user)
        }
    }

    let handleMessage = async () => {
        socketRef.current.emit('sendMessage', { recieverId: props.id._id, userId: userToken?.user?.userDetails._id, message: inp })

        let data = await axios.post('http://localhost:3000/message/create', { recieverId: props.id._id, message: inp }, {
            headers: {
                'Authorization': userToken.token
            }
        })
        // console.log(data.data)
        getMessage()
        setInp('')
    }

    let userId = userToken.user.userDetails._id

    useEffect(() => {
        socketRef.current = io(Endpoint, { transports: ['websocket'] });
        socketRef.current.emit('addUser', userToken?.user?.userDetails._id)
    }, [])
    useEffect(()=>{
        socketRef.current.on("getMessage", ({ recieverId, userId, message })=>{
            console.log({ recieverId, userId, message })
            setNewMessage({ recieverId, senderId:userId, message, createdAt:Date.now() })
        })
    },[])
    useEffect(()=>{
        if(newMessage){
            setMessage([...message, newMessage])
        }
    },[newMessage])

    return (
        <div className=''>
            <button className='text-end bg-blue-400 px-2 rounded text-white ms-96 mb-1' onClick={() => setClose(!close)}>
                {close ? 'Close' : 'Open'}
            </button>
            {close && <div className='h-[50vh] w-96 rounded flex flex-col justify-between ms-4 p-2 border-2 border-black'>
                <div className='w-full bg-blue-500 h-10 text-white rounded text-right pe-2 mb-2'>
                    {user?.map((ele, key) => (
                        ele?._id != userId && <p key={key}>{ele?.name}</p>
                    ))}
                </div>
                <ScrollToBottom className='overflow-auto mb-1'>
                    {message.map((ele, key) => (
                        <div key={key} className='flex items-center'>
                            {ele.senderId == userToken.user.userDetails._id ?
                                <div className='flex gap-2'>
                                    <div className='w-40 p-2 rounded text-end text-sm bg-blue-400 mb-2 ms-36'>{ele.message}
                                        <span className='text-xs block'>{formatDistanceToNow(ele.createdAt, {addSuffix:true})}</span>
                                    </div>
                                    {ele.senderId == userToken.user.userDetails._id && user.map((item, key) => (
                                        userId == item._id && <img key={key} className='h-10 w-10 rounded-full inline border border-black' src={item.profilePic} alt={item.name[0]}></img>
                                    ))}
                                </div>
                                :
                                <div className='flex gap-2'>
                                    {ele.senderId != userToken.user.userDetails._id && user.map((item, key) => (
                                        userId != item._id && <img key={key} className='h-10 w-10 rounded-full border border-black' src={item.profilePic} alt={item.name[0]}></img>
                                    ))}
                                    <div className='w-40 text-sm p-2 rounded bg-green-400 mb-2'>{ele.message}
                                    <span className='text-xs block'>{formatDistanceToNow(ele.createdAt, {addSuffix:true})}</span>
                                    </div>
                                </div>
                            }
                        </div>
                    ))}
                </ScrollToBottom>
                <div className='mb-2 flex items-center mt-1'>
                    <textarea type="text" name="" id="" className='p-2 h-10 w-full resize-none rounded text-sm focus:outline-none border' onChange={(e) => setInp(e.target.value)} value={inp} />
                    <button className='bg-blue-500 px-4 py-2 rounded ms-2 text-white' onClick={handleMessage}>Send</button>
                </div>
            </div>}
        </div>
    )
}

export default memo(Chat)