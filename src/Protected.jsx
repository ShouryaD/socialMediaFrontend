import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { fetchUserById } from './store/slice/UserSlice'
import { Navigate, Outlet } from 'react-router-dom'

export default function Protected({children}) {
    let user = useSelector((state)=>state.user)
    console.log(user)

    useEffect(()=>{
        if(!user){
            fetchUserById(user.token)
        }
    },[])
    console.log(user.login)
  return (
    user.login ? children : <Navigate to='/login'/>
  )
}
