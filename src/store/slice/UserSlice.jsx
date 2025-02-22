import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

let userDetails = JSON.parse(localStorage.getItem('twitterLogin'))
const initialState = {
  login: userDetails ? userDetails.login : false,
  token: userDetails ? userDetails.token : '',
  user: userDetails ? userDetails.user : '',
  foundUser: ''
}
let endpoint = import.meta.env.VITE_DEPLOYMENT == 'PRODUCTION' ? import.meta.env.VITE_ENDPOINT :'http://127.0.0.1:3000'
export const fetchUserById = createAsyncThunk(
  'users/fetchByIdStatus',
  async (token) => {
    const response = await axios.get(endpoint + '/users/getInfo', {
      headers: {
        'Authorization': token
      }
    })
    return response.data
  },
)
// export const searchUser = createAsyncThunk(
//   'users/searchUser',
//   async (user) => {
//     let users = await axios.get(`http://127.0.0.1:3000/users/search?name=${user}`)
//     return users.data
//   },
// )

export const fetchMessages = createAsyncThunk(
  'users/fetchMessages',
  async (token, recieverId) => {
    const response = await axios.get('http://localhost:3000/message/getMessage', { recieverId }, {
      headers: {
        'Authorization': token
      }
    })
    return response.data
  }
)

export const UserSlice = createSlice({
  name: 'UserSlice',
  initialState,
  reducers: {
    setState: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.login = true
      state.token = action.payload
      localStorage.setItem('twitterLogin', JSON.stringify({ login: true, token: action.payload, user: '' }))
    },

    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
    logout: (state, action) => {
      localStorage.removeItem('twitterLogin')
      state.login = false
      state.user = ''
      state.token = ''
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      console.log(action.payload)
      state.user = action.payload
      // localStorage.setItem('twitterLogin', JSON.stringify({...state, user:action.payload}))
    }),
      builder.addCase(fetchUserById.rejected, (state, action) => {
        console.log(action.payload)
      })
    // builder.addCase(searchUser.fulfilled, (state, action) => {
    //   console.log('User Searched')
    //   state.foundUser = action.payload
    //   console.log(state.foundUser)
    // })
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      console.log(state.user)
    })
  },
})

// Action creators are generated for each case reducer function
export const { setState, incrementByAmount, logout } = UserSlice.actions

export default UserSlice.reducer