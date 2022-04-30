import { createStore } from "redux";

const initialState = {
  userName: "",
  _id: "",
  logged: false,
};
const chatReducer = (state = initialState, action) => {
  console.log(action);
  if (action.type === "signIn") {
    return {
      ...state,
      userName: action.value.userName,
      _id: action.value._id,
      logged: true,
    };
  }
  if (action.type === "logout") {
    return {
      ...state,
      userName: "",
      _id:"",
      logged: action.value,
    };
  }
  return state;
};
const chatStore = createStore(
  chatReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default chatStore;
