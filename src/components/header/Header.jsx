import React from 'react'
import { Nav, Navbar, Row, Col } from 'react-bootstrap'
import { useCookies } from 'react-cookie'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useState } from 'react'
import { setSearch } from '../../actions'
import { ChatRight, Bell } from 'react-bootstrap-icons'
import { logout } from '../../actions'
import './header.css'

const Header = (props) => {
	const [searchQuery, setSearchQuery] = useState('')
	// eslint-disable-next-line
	const [cookies, setCookie, removeCookie] = useCookies(['token'])
	const loggedUser = useSelector((state) => state.loggedUser)
	const dispatch = useDispatch()

	const submitSearch = (e) => {
		e.preventDefault()
		dispatch(setSearch(searchQuery))
		setSearchQuery('')
		props.history.push('/search')
	}

	const signOut = () => {
		removeCookie('token')
		props.history.push(`/`)
		dispatch(logout())
	}

	return (
		<>
			<Navbar className="navbar d-flex justify-content-between px-5 mb-3">
				<Col md={2}>
					<img
						src="https://res.cloudinary.com/dikhui7af/image/upload/v1678118692/frsgdtgk_eoa3o8.png"
						alt=""
						className="logo py-3 pointer"
						// onClick={() => props.history.push(`/profile/${loggedUser._id}`)}
					/>
				</Col>
				<Col md={8} className="d-flex justify-content-center">
					{/* <Form onSubmit={submitSearch} className="align-self-center">
            <Form.Control
              type="text"
              placeholder="Find notes, tutors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-field"
            />
          </Form> */}
					<div className="mx-4 align-self-center nav-txt pointer">Surebets</div>
					<div className="align-self-center mx-4 nav-txt pointer">Valuebets</div>
					<div className="align-self-center mx-4 nav-txt pointer">Matched Betting</div>
					{/* <Nav>
						{loggedUser.avatar !== '' && (
							<NavDropdown
								id="nav-dropdown-dark-example"
								alignRight
								title={
									<>
										<img src={loggedUser.avatar} alt="" className="rounded-circle sm-avatar align-self-center" />
									</>
								}
							>
								<NavDropdown.Item onClick={() => props.history.push('/console')}>Console</NavDropdown.Item>
								<NavDropdown.Item>Groups</NavDropdown.Item>
								<NavDropdown.Item onClick={() => props.history.push(`/profile/${loggedUser._id}`)}>Profile</NavDropdown.Item>
								<NavDropdown.Item>Edit Profile</NavDropdown.Item>
								<NavDropdown.Divider />
								<NavDropdown.Item onClick={signOut}>Sign out</NavDropdown.Item>
							</NavDropdown>
						)}
					</Nav> */}
				</Col>
				<Col md={2} className="d-flex justify-content-end">
					<div className="align-self-center pointer nav-txt2">Account</div>
				</Col>
			</Navbar>
		</>
	)
}

export default withRouter(Header)
