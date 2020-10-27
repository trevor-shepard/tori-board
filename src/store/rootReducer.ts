import { combineReducers } from '@reduxjs/toolkit'
import art from './slices/artSlice'

const rootReducer = combineReducers({
	art
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
