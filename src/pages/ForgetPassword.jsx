import axios from 'axios'
import React, { memo, useRef, useState } from 'react'

function ForgetPassword() {
    let endpoint = import.meta.env.VITE_DEPLOYMENT == 'PRODUCTION' ? import.meta.env.VITE_ENDPOINT :'http://127.0.0.1:3000'
    let emailRef = useRef()
    let [msg,setMsg] = useState('')

    
    let handleSubmit = async(e)=>{
        let obj = {
            email:emailRef.current.value
        }
        e.preventDefault()
        let data = await axios.post(endpoint + '/users/forgot-password',obj)
        console.log(data.data)
        setMsg(data.data.msg)
    }
  return (
    <div>
        <div className='h-screen w-screen flex flex-col gap-10 justify-center items-center'>
            <h1>{msg}</h1>
            <h1>Forgot Password?</h1>
            <input type="text" name="" id="" ref={emailRef} className='bg-cyan-700 rounded p-4 text-white border-none'/>
            <button onClick={handleSubmit} className='px-4 py-2 bg-cyan-700 hover:bg-cyan-500 text-white rounded-xl'>Submit</button>
        </div>
    </div>
  )
}

export default memo(ForgetPassword)
