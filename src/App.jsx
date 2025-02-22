import { memo, useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import {Outlet} from 'react-router-dom'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById } from './store/slice/UserSlice';

function App() {
  let dispatch = useDispatch()
  let userDetails = useSelector((state)=>state.user)
  console.log(userDetails)
  let token = userDetails.token
  console.log(token)

  useEffect(()=>{
    dispatch(fetchUserById(token))
  }, [token])
  return (
    <>
      <Navbar/>
      <Outlet/>
      <ToastContainer />
    </>
  )
}

export default memo(App)
