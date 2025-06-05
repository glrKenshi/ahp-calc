import { configureStore } from "@reduxjs/toolkit";
import tasks from '../slices/tasksSlice'

const store = configureStore({
    reducer: {tasks},
    devTools: process.env.NODE_ENV !== 'production',
})

export default store