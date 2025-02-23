import React, { memo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { fetchUserById, setState } from '../store/slice/UserSlice'

function Login() {
    let endpoint = import.meta.env.VITE_DEPLOYMENT == 'PRODUCTION' ? import.meta.env.VITE_ENDPOINT :'http://127.0.0.1:3000'
    let dispatch = useDispatch()
    let [details, setDetails] = useState({
        email: '',
        password: ''
    })
    let navigate = useNavigate()
    let handleChange = (e) => {
        // console.log(e.target.name)
        // console.log(e.target.value)
        setDetails({ ...details, [e.target.name]: e.target.value })
    }

    let handleSubmit = async (e) => {
        let res = await axios.post(endpoint + '/users/login', details)
        // console.log(details)
        // console.log(res.data)
        if (res.data.success) {
            toast.success(res.data.success, { position: 'top-center' })
            dispatch(setState(res.data.user))
            // dispatch(fetchUserById(res.data.user))
            navigate('/')
        }
        else {
            toast.error(res.data.msg, { position: 'top-center' })
            setDetails({email:'', password:''})
            // window.location.reload() if we do this then there will no vdom but dom
        }
    }

    return (
        <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0">
            <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
                <div
                    className="hidden md:block lg:w-1/2 bg-cover bg-blue-700"
                    style={{
                        backgroundImage: `url(https://www.tailwindtap.com//assets/components/form/userlogin/login_tailwindtap.jpg)`,
                    }}
                ></div>
                <div className="w-full p-8 lg:w-1/2">
                    <p className="text-xl text-gray-600 text-center">Welcome back!</p>
                    <div className="mt-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email Address
                        </label>
                        <input
                            className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                            type="email"
                            name='email'
                            required
                            onChange={handleChange} value={details.email}
                        />
                    </div>
                    <div className="mt-4 flex flex-col justify-between">
                        <div className="flex justify-between">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Password
                            </label>
                        </div>
                        <input
                            className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
                            type="password"
                            name='password'
                            onChange={handleChange}
                            value={details.password}
                        />
                        <Link
                            to="/forgotPassword"
                            className="text-xs text-gray-500 hover:text-gray-900 text-end w-full mt-2"
                        >
                            Forget Password?
                        </Link>
                    </div>
                    <div className="mt-8">
                        <button onClick={handleSubmit} type='submit' className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600">
                            Login
                        </button>
                    </div>
                    <a
                        href="#"
                        className=" flex items-center justify-center mt-4 text-white rounded-lg shadow-md hover:bg-gray-100"
                    >

                    </a>
                    <div className="mt-4 flex items-center w-full text-center">
                        <Link
                            to="/register"
                            className="text-xs text-gray-500 capitalize text-center w-full"
                        >
                            Don&apos;t have any account yet?
                            <span className="text-blue-700"> Sign Up</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(Login)