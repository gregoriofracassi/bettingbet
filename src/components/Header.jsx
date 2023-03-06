import React from "react"
import { Nav, Navbar, NavDropdown, Form } from "react-bootstrap"
import { useCookies } from "react-cookie"
import { useSelector } from "react-redux"
import { withRouter } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useState } from "react"
import { setSearch } from "../actions"
import { ChatRight, Bell } from "react-bootstrap-icons"
import { logout } from "../actions"
import "./styles/header.css"

const Header = (props) => {
  const [searchQuery, setSearchQuery] = useState("")
  // eslint-disable-next-line
  const [cookies, setCookie, removeCookie] = useCookies(["token"])
  const loggedUser = useSelector((state) => state.loggedUser)
  const dispatch = useDispatch()

  const submitSearch = (e) => {
    e.preventDefault()
    dispatch(setSearch(searchQuery))
    setSearchQuery("")
    props.history.push("/search")
  }

  const signOut = () => {
    removeCookie("token")
    props.history.push(`/`)
    dispatch(logout())
  }

  return (
    <>
      <Navbar className="navbar d-flex justify-content-between px-3 mb-3">
        <div>
          <img
            src="https://res.cloudinary.com/dikhui7af/image/upload/v1678118692/frsgdtgk_eoa3o8.png"
            alt=""
            // className="logo py-2 pointer"
            onClick={() => props.history.push(`/profile/${loggedUser._id}`)}
          />
        </div>
        <Nav>
          <Form onSubmit={submitSearch} className="align-self-center">
            <Form.Control
              type="text"
              placeholder="Find notes, tutors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-field"
            />
          </Form>
          <Nav.Link className="ml-3 align-self-center lg-txt">
            <ChatRight size="1.2em" />
          </Nav.Link>
          <Nav.Link className="align-self-center mx-2">
            <Bell size="1.2em" />
          </Nav.Link>
          <Nav>
            {loggedUser.avatar !== "" && (
              <NavDropdown
                id="nav-dropdown-dark-example"
                alignRight
                title={
                  <>
                    <img
                      src={loggedUser.avatar}
                      alt=""
                      className="rounded-circle sm-avatar align-self-center"
                    />
                  </>
                }
              >
                <NavDropdown.Item
                  onClick={() => props.history.push("/console")}
                >
                  Console
                </NavDropdown.Item>
                <NavDropdown.Item>Groups</NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() =>
                    props.history.push(`/profile/${loggedUser._id}`)
                  }
                >
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item>Edit Profile</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={signOut}>Sign out</NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Nav>
      </Navbar>
      <div className="cookis-bar d-flex justify-content-between"></div>
    </>
  )
}

export default withRouter(Header)
