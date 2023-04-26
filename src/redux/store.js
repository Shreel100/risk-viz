import { configureStore } from '@reduxjs/toolkit';

// Define initial state
const initialState = {
  year: ''
};

// Define reducer
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SELECTED_YEAR':
      return {
        ...state,
        year: action.payload
      };
    default:
      return state;
  }
};

// Define actions
export const setSelectedYear = (year) => ({
  type: 'SET_SELECTED_YEAR',
  payload: year
});

// Create store
const store = configureStore({
  reducer: rootReducer
});

export default store;

