import { initialState } from "../store"

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_LOGGED_USER":
      return {
        ...state,
        loggedUser: action.payload,
      }
    case "LOGOUT":
      return {
        loggedUser: {
          avatar: "",
        },
      }
    case "SET_SEARCH_KEY":
      return {
        ...state,
        searchQuery: action.payload,
      }
    default:
      return state
  }
}

export default rootReducer
