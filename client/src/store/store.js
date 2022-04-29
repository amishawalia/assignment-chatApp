import { createStore } from "redux";

const initialState = {
    userName:'',
    logged:false
  
};
const chatReducer = (state = initialState, action) => {
  
    console.log(action);
    if (action.type === 'signIn' ) {
        return {
            ...state,
            userName:action.value,
            logged:true,
        }
    }
  return state;
};
const chatStore = createStore(
  chatReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default chatStore;