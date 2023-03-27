import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import {
  getUserFromLocalStorage,
  addUserToLocalStorage,
  removeUserFromLocalStorage,
} from '../../utils/localStorage'
import {
  registerUserThunk,
  loginUserThunk,
  updateUserThunk,
  clearStoreThunk,
} from './userThunk'

const initialState = {
  isLoading: false,
  isSidebarOpen: false,
  user: getUserFromLocalStorage(),
}

export const registerUser = createAsyncThunk(
  'user/registerUser',
  registerUserThunk
)
export const loginUser = createAsyncThunk('user/loginUser', loginUserThunk)
export const updateUser = createAsyncThunk('user/updateUser', updateUserThunk)
export const clearStore = createAsyncThunk('user/clearStore', clearStoreThunk)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen
    },
    logoutUser: (state, { payload }) => {
      state.user = null
      state.isSidebarOpen = false
      removeUserFromLocalStorage()
      if (payload) {
        toast.success(payload)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        const { user } = action.payload
        state.user = user
        addUserToLocalStorage(user)
        toast.success(`Hello there, ${user.name}`)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        toast.error(action.payload)
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { user } = action.payload
        state.isLoading = false
        state.user = user
        addUserToLocalStorage(user)
        toast.success(`Welcome back ${user.name}`)
      })
      .addCase(loginUser.rejected, (stat, action) => {
        state.isLoading = false
        toast.error(action.payload)
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const { user } = action.payload
        state.user = user
        state.isLoading = false

        addUserToLocalStorage(user)
        toast.success('user updated')
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false
        toast.error(action.payload)
      })
      .addCase(clearStore.rejected, () => {
        toast.error('There was an error')
      })
  },
})
export default userSlice.reducer
export const { toggleSidebar, logoutUser } = userSlice.actions
