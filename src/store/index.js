import { createStore, applyMiddleware, compose } from "redux"
import rootReducer from "../reducers/index"
import thunk from "redux-thunk"

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const initialState = {
  loggedUser: {
    role: "",
    avatar: "",
    subjects: [],
    availableSubjects: [
      {
        _id: "",
        subject: "",
      },
    ],
    _id: "",
    email: "",
    name: "",
    surname: "",
    about: "",
    course: {
      uni: [],
      subjects: [{}],
      _id: "",
      course: "",
    },
    uni: {
      _id: "",
      name: "",
      location: "",
    },
    hourlyFee: 0,
    comments: [{ author: "", content: "" }],
    notesRatings: [],
    tutorRatings: [],
  },
  searchQuery: "",
}

const configureStore = () =>
  createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunk))
  )

export default configureStore
