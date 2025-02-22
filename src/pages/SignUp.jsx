import React, { memo, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function SignUp() {
let endpoint = import.meta.env.VITE_DEPLOYMENT == 'PRODUCTION' ? import.meta.env.VITE_ENDPOINT :'http://127.0.0.1:3000'
    let ctx = useSelector((state)=>state.user)
    console.log(ctx)

    let nameRef = useRef()
    let emailRef = useRef()
    let passwordRef = useRef()
    let navigate = useNavigate()

    let handleSubmit = async (e) => {
        e.preventDefault()
        let obj = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value
        }
        console.log(obj)
        let res = await fetch(endpoint + '/users/register', {
            method: "POST",
            headers:{
                //sending data in json 
                'content-type':'application/json'
            },
            //we use body here bcs we use req.body in backend
            body:JSON.stringify(obj)
        })
        let data = await res.json()
        console.log(data)
        if(data.success){
            toast.success(data.msg, {
                position: 'top-center'
            })
            navigate('/login')
        }
        else{
            toast.error(data.msg, {
                position:'top-center'
            })
        }
    }
    return (
        <div className="h-[100vh] items-center flex justify-center px-5 lg:px-0">
            <div className="max-w-screen-xl bg-white border shadow sm:rounded-lg flex justify-center flex-1">
                <div className="flex-1 bg-blue-900 text-center hidden md:flex">
                    <div
                        className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
                        style={{
                            backgroundImage: `url(https://www.tailwindtap.com/assets/common/marketing.svg)`,
                        }}
                    ></div>
                </div>
                <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
                    <div className=" flex flex-col items-center">
                        <div className="text-center">
                            <h1 className="text-2xl xl:text-4xl font-extrabold text-blue-900">
                                Sign up
                            </h1>
                            <p className="text-[12px] text-gray-500">
                                Hey enter your details to create your account
                            </p>
                        </div>
                        <div className="w-full flex-1 mt-8">
                            <div className="mx-auto max-w-xs flex flex-col gap-4">
                                <input
                                    className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                    type="text"
                                    placeholder="Enter your name"
                                    ref={nameRef}
                                />
                                <input
                                    className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                    type="email"
                                    placeholder="Enter your email"
                                    ref={emailRef}
                                />

                                <input
                                    className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                                    type="password"
                                    placeholder="Password"
                                    ref={passwordRef}
                                />
                                <button onClick={handleSubmit} className="mt-5 tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
                                    <svg
                                        className="w-6 h-6 -ml-2"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                        <circle cx="8.5" cy="7" r="4" />
                                        <path d="M20 8v6M23 11h-6" />
                                    </svg>
                                    <span className="ml-3">Sign Up</span>
                                </button>
                                <p className="mt-6 text-xs text-gray-600 text-center">
                                    Already have an account?{" "}
                                    <Link to="/login">
                                        <span className="text-blue-900 font-semibold">Sign in</span>
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(SignUp)