import React from "react"
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Alert,
} from "react-bootstrap"
import "./styles/profile.css"
import { useState } from "react"
import { useCookies } from "react-cookie"
import { useDispatch } from "react-redux"
import { setLoggedUser } from "../actions"

const InitialPage = (props) => {
  const [showAlert, setShowAlert] = useState(true)
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [Regemail, setRegEmail] = useState("")
  const [surname, setSurname] = useState("")
  const [password, setPassword] = useState("")
  const [Regpassword, setRegPassword] = useState("")
  // eslint-disable-next-line
  const [cookies, setCookie] = useCookies(["token"])
  const dispatch = useDispatch()

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleLogin = async () => {
    handleClose()
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: Regemail ? Regemail : email,
          password: Regpassword ? Regpassword : password,
        }),
      })
      if (response.ok) {
        const data = await response.json()
        setCookie("token", data.accessToken, { path: "/" })
        dispatch(setLoggedUser(data.accessToken))
        props.history.push(`/profile/${data.userId}`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleRegister = async () => {
    const userToReg = {
      email: Regemail,
      password: Regpassword,
      name: name,
      surname: surname,
    }
    console.log(userToReg)
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userToReg),
        }
      )
      if (response.ok) {
        const data = await response.json()
        console.log(data)
        handleLogin()
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Container>
        {showAlert && (
          <Alert
            variant="success"
            onClose={() => setShowAlert(false)}
            dismissible
          >
            <Alert.Heading>
              User registration currently under maintenance!
            </Alert.Heading>
            <p>
              If you want to explore the app's functionalities, please Sign in
              with the mockup user:
              <br />
              Email: <span className="font-italic">example@example.com</span>
              <br />
              Password: <span className="font-italic">ExamplePassword</span>
            </p>
          </Alert>
        )}
        <Row>
          <Col md={4}>
            <div>
              <h3 className="mt-4">
                Welcome to the
                <br />
                <span>
                  <img
                    src="https://res.cloudinary.com/difofe2r8/image/upload/v1634398898/UniHub/logouuu_ckifta.png"
                    alt=""
                    className="logosize my-2"
                  />
                </span>{" "}
                Community!
              </h3>
            </div>
            <Form className="mt-3">
              <Form.Group className="mb-2">
                <Form.Label>First name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  value={Regemail}
                  onChange={(e) => setRegEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={Regpassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                />
              </Form.Group>
            </Form>
            <div className="d-flex align-items-center justify-content-between mt-4">
              <div>
                Already a user?
                <span onClick={handleShow} className="pointer">
                  <b> Sign in</b>
                </span>
              </div>
              <div>
                <Button className="green-btn" onClick={handleRegister} disabled>
                  Register
                </Button>
              </div>
            </div>
          </Col>
          <Col md={8}>
            <img
              src="https://res.cloudinary.com/difofe2r8/image/upload/v1634397449/UniHub/undraw_researching_22gp_1_jtvrfy.svg"
              alt=""
              className="img-fluid"
            />
          </Col>
        </Row>
      </Container>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body>
          <Form>
            <Form.Group
              as={Row}
              className="my-3"
              controlId="formPlaintextEmail"
            >
              <Form.Label column sm="2">
                Email
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Col>
            </Form.Group>

            <Form.Group
              as={Row}
              className="mb-3"
              controlId="formPlaintextPassword"
            >
              <Form.Label column sm="2">
                Password
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Col>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleLogin}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default InitialPage
