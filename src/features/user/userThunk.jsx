import customFetch, { checkForUnauthorizedResponse } from '../../utils/axios'
import { clearAllJobsState } from '../allJobs/allJobsSlice'
import { clearValues } from '../job/jobSlice'
import { logoutUser } from '../user/userSlice'

export const registerUserThunk = async (user, thunkAPI) => {
  try {
    const response = await customFetch.post('/auth/register', user)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg)
  }
}

export const loginUserThunk = async (user, thunkAPI) => {
  try {
    const response = await customFetch.post('/auth/login', user)
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.msg)
  }
}

export const updateUserThunk = async (user, thunkAPI) => {
  try {
    const response = await customFetch.patch('/auth/updateUser', user)
    return response.data
  } catch (error) {
    return checkForUnauthorizedResponse(error, thunkAPI)
  }
}

export const clearStoreThunk = async (message, thunkAPI) => {
  try {
    thunkAPI.dispatch(logoutUser(message))
    thunkAPI.dispatch(clearAllJobsState())
    thunkAPI.dispatch(clearValues())
    return Promise.resolve()
  } catch (error) {
    return Promise.reject()
  }
}
