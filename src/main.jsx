import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx'
import SignUp from './pages/SignUp.jsx'
import Login from './pages/Login.jsx'
import Pnf from './pages/Pnf.jsx'
import { store } from './store/store.js'
import { Provider, useSelector } from 'react-redux'
import Profile from './pages/Profile.jsx'
import Protected from './Protected.jsx'
import UserPage from './pages/UserPage.jsx'
import ForgetPassword from './pages/ForgetPassword.jsx'
import HomeCopy from './pages/HomeCopy.jsx'
import Caraousel from './components/Caraousel.jsx'

let router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='' element={
        <Protected>
          <Home />
          {/* <HomeCopy /> */}
        </Protected>
        } />
      <Route path='/profile' element={
        <Protected>
          <Profile />
        </Protected>
        } />
      <Route path='/register' element={<SignUp />} />
      <Route path='/login' element={<Login />} />
      <Route path='/userPage' element={<UserPage />} />
      <Route path='/forgotPassword' element={<ForgetPassword />} />
      <Route path='/cara' element={<Caraousel />} />
      <Route path='/*' element={<Pnf />} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>

)
