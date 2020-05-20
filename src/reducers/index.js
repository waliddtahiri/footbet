import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';


export const rootReducer = combineReducers({
  error: errorReducer,
  auth: authReducer
})