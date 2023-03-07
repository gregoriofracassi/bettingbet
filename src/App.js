// import React, { useEffect } from "react"
import "./App.css"
import Header from "./components/header/Header"
// import Profile from "./components/Profile"
import "bootstrap/dist/css/bootstrap.min.css"
import { BrowserRouter as Router, Route } from "react-router-dom"
// import MySessions from "./components/MySessions"
// import InitialPage from "./components/InitialPage"
// import Console from "./components/Console"
// import SearchResults from "./components/SearchResults"
// import { useDispatch, useSelector } from "react-redux"
// import { useCookies } from "react-cookie"
// import { setLoggedUser } from "./actions"
import Footer from "./components/Footer"
import Arbitrage from "./components/arbitrage/Arbitrage"

const App = () => {
  // const [cookies] = useCookies(["accessToken"])

  // const dispatch = useDispatch()
  // const loggedUser = useSelector((state) => state.loggedUser)

  // const checkIfLogged = () => {
  //   if (loggedUser._id === "" && cookies.token) {
  //     dispatch(setLoggedUser(cookies.token))
  //   }
  // }

  // useEffect(() => {
  //   checkIfLogged()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  return (
    <>
      <Router>
        <Header />
        <Route component={Arbitrage} path="/" exact />
        {/* <Route component={Profile} path="/profile/:id" />
        <Route component={Console} path="/console" />
        <Route component={MySessions} path="/mySessions/:id" />
        <Route component={SearchResults} path="/search" /> */}
        {/* <Footer /> */}
      </Router>
    </>
  )
}

export default App
