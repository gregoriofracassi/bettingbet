import React, { useState, useEffect } from "react"
import "./styles/searchResults.css"
import { Container, Row, Col } from "react-bootstrap"
import { useSelector } from "react-redux"
import UserCard from "./UserCard"
import { useCookies } from "react-cookie"
import { Card, Button, Modal } from "react-bootstrap"
import { format } from "date-fns"

const SearchResults = (props) => {
  const [cookies] = useCookies(["accessToken"])
  const [purchaseCompleted, setPurchaseCompleted] = useState(false)
  const [buyModal, setBuyModal] = useState(false)
  const [searchResult, setSearchResult] = useState({
    subject: { subject: "" },
    uni: {
      notes: [
        {
          _id: "",
          author: { _id: "", name: "", surname: "" },
          course: { course: "" },
          createdAt: "01 Jan 1970 00:00:00 GMT",
        },
      ],
      sessions: [
        {
          _id: "",
          avatar: "",
          name: "",
          surname: "",
          course: { course: "" },
        },
      ],
      users: [
        {
          id: "",
          avatar: "",
          name: "",
          surname: "",
          uni: { location: "", name: "" },
        },
      ],
    },
    other: {
      notes: [
        {
          _id: "",
          author: { _id: "", name: "", surname: "" },
          course: { course: "" },
          uni: { name: "", location: "" },
          createdAt: "01 Jan 1970 00:00:00 GMT",
        },
      ],
      sessions: [
        {
          _id: "",
          avatar: "",
          name: "",
          surname: "",
          course: { course: "" },
          uni: { name: "", location: "" },
        },
      ],
      users: [
        {
          id: "",
          avatar: "",
          name: "",
          surname: "",
          uni: { name: "", location: "" },
        },
      ],
    },
  })
  const [notesToBuy, setNotesToBuy] = useState({
    author: { name: "", surname: "" },
    price: 0,
    subject: { subject: "" },
  })
  const query = useSelector((state) => state.searchQuery)
  const loggedUser = useSelector((state) => state.loggedUser)

  const showBuyModal = (notes) => {
    setBuyModal(true)
    setNotesToBuy(notes)
  }
  const closeBuyModal = () => {
    setBuyModal(false)
    if (purchaseCompleted) {
      setPurchaseCompleted(false)
    }
  }

  const buyNotes = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/notes/${notesToBuy._id}/purchase`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      )
      if (response.ok) {
        setPurchaseCompleted(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const downloadNotes = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/notes/download/${notesToBuy.contentKey}`,
        {
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      )
      if (response.ok) {
        console.log("response", response)
        const downloaded = await response.blob()
        var url = window.URL.createObjectURL(await downloaded)
        var a = document.createElement("a")
        a.href = url
        a.download = `${notesToBuy.subject.subject}_UniHub.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const getSearchResult = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL}/search?key=${query}`,
          {
            headers: {
              Authorization: `Bearer ${cookies.token}`,
            },
          }
        )
        if (response.ok) {
          const result = await response.json()
          setSearchResult(result)
          console.log(result)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getSearchResult()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return (
    <>
      <Modal show={buyModal} onHide={closeBuyModal} centered>
        <Modal.Body className="py-4">
          {purchaseCompleted ? (
            <>
              Purchase Successful! <br />
              You can download now, or else you'll find 'em in your console
            </>
          ) : (
            <>
              do you wish to procced with the purchase of{" "}
              {notesToBuy.author?.name} {notesToBuy.author.surname}'s'{" "}
              {notesToBuy.subject.subject} notes? <br />
              Total: €{notesToBuy.price}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={purchaseCompleted ? downloadNotes : buyNotes}
            size="sm"
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      <Container>
        <Row>
          <Col md={3}>
            <UserCard user={loggedUser} />
          </Col>
          <Col md={8}>
            {(searchResult.uni.notes.length !== 0 ||
              searchResult.uni.sessions.length !== 0 ||
              searchResult.uni.users.length !== 0) && (
              <Card className="mb-3 border-green">
                <Card.Body>
                  search results for '{query}'<br />
                  <h5 className="mb-5 thicker grey font-italic">
                    From {loggedUser.uni?.name}, {loggedUser.uni?.location}
                  </h5>
                  <div>
                    {searchResult.uni.notes.length !== 0 &&
                      searchResult.uni.notes
                        .map((notes) => {
                          return (
                            <div
                              className="d-flex justify-content-between"
                              key={notes._id}
                            >
                              <div
                                className="d-flex pointer"
                                onClick={() =>
                                  props.history.push(
                                    `/profile/${notes.author._id}`
                                  )
                                }
                              >
                                <img
                                  src="https://res.cloudinary.com/difofe2r8/image/upload/v1633787735/UniHub/File_Formats__728_1_fsewg3.jpg"
                                  alt=""
                                  className="notes-img align-self-center"
                                />
                                <div className="ml-3 align-self-center">
                                  <span className="thicker green">
                                    {searchResult.subject.subject}
                                  </span>{" "}
                                  notes by {notes.author?.name}{" "}
                                  {notes.author.surname}
                                  <br />
                                  <span className="medbig-txt">
                                    {notes.course.course}
                                  </span>{" "}
                                  student <br />
                                  {format(
                                    Date.parse(notes.createdAt),
                                    "MMM d y"
                                  )}
                                </div>
                              </div>
                              <div className="align-self-center">
                                <Button
                                  className="rounded-pill book-btn"
                                  size="sm"
                                  onClick={() => showBuyModal(notes)}
                                >
                                  Buy Now!
                                </Button>
                              </div>
                            </div>
                          )
                        })
                        .reduce((prev, curr) => [
                          prev,
                          <hr key={curr._id} />,
                          curr,
                        ])}
                    {searchResult.uni.sessions.length !== 0 && (
                      <>
                        {searchResult.uni.notes.length !== 0 && <hr />}
                        {searchResult.uni.sessions
                          .map((user) => {
                            return (
                              <div
                                className="d-flex justify-content-between"
                                key={user._id}
                              >
                                <div
                                  className="d-flex pointer"
                                  onClick={() =>
                                    props.history.push(`/profile/${user._id}`)
                                  }
                                >
                                  <img
                                    src={user.avatar}
                                    alt=""
                                    className="rounded-circle user-img align-self-center"
                                  />
                                  <div className="ml-3">
                                    {user?.name} {user.surname} <br />
                                    <span className="medbig-txt">
                                      {user.course.course} student <br />
                                    </span>
                                    Currently available for{" "}
                                    <span className="thicker green">
                                      {searchResult.subject.subject}
                                    </span>{" "}
                                    tutoring
                                  </div>
                                </div>
                                <div className="align-self-center">
                                  <Button
                                    className="rounded-pill book-btn"
                                    size="sm"
                                    onClick={() =>
                                      props.history.push(`/profile/${user._id}`)
                                    }
                                  >
                                    Check Availability
                                  </Button>
                                </div>
                              </div>
                            )
                          })
                          .reduce((prev, curr) => [
                            prev,
                            <hr key={curr._id} />,
                            curr,
                          ])}
                      </>
                    )}
                    {searchResult.uni.users.length !== 0 && (
                      <>
                        {(searchResult.uni.notes.length !== 0 ||
                          searchResult.uni.sessions.length !== 0) && <hr />}
                        {searchResult.uni.users
                          .map((user) => {
                            return (
                              <div
                                className="d-flex justify-content-between"
                                key={user._id}
                              >
                                <div
                                  className="d-flex pointer"
                                  onClick={() =>
                                    props.history.push(`/profile/${user._id}`)
                                  }
                                >
                                  <img
                                    src={user.avatar}
                                    alt=""
                                    className="rounded-circle user-img align-self-center"
                                  />
                                  <div className="ml-3">
                                    <span className="thicker green">
                                      {user?.name} {user.surname}
                                    </span>
                                    <br />
                                    Student at {user.uni?.name} <br />
                                    <div className="medbig-txt">
                                      {user.uni?.location}
                                    </div>
                                  </div>
                                </div>
                                <div className="align-self-center">
                                  <Button
                                    className="rounded-pill book-btn"
                                    size="sm"
                                    onClick={() =>
                                      props.history.push(`/profile/${user._id}`)
                                    }
                                  >
                                    Visit Profile
                                  </Button>
                                </div>
                              </div>
                            )
                          })
                          .reduce((prev, curr) => [
                            prev,
                            <hr key={curr._id} />,
                            curr,
                          ])}
                      </>
                    )}
                  </div>
                </Card.Body>
              </Card>
            )}
            {(searchResult.other.notes.length !== 0 ||
              searchResult.other.sessions.length !== 0 ||
              searchResult.other.users.length !== 0) && (
              <Card>
                <Card.Body>
                  <div>
                    {searchResult.other.notes.length !== 0 &&
                      searchResult.other.notes
                        .map((notes) => {
                          return (
                            <div
                              className="d-flex justify-content-between"
                              key={notes._id}
                            >
                              <div
                                className="d-flex pointer"
                                onClick={() =>
                                  props.history.push(
                                    `/profile/${notes.author._id}`
                                  )
                                }
                              >
                                <img
                                  src="https://res.cloudinary.com/difofe2r8/image/upload/v1633787735/UniHub/File_Formats__728_1_fsewg3.jpg"
                                  alt=""
                                  className="notes-img align-self-center"
                                />
                                <div className="ml-3 align-self-center">
                                  <span className="thicker green">
                                    {searchResult.subject.subject}{" "}
                                  </span>
                                  notes by {notes.author?.name}{" "}
                                  {notes.author.surname}
                                  <br />
                                  <span className="medbig-txt">
                                    {notes.uni?.name}, {notes.uni?.location}
                                  </span>
                                  <br />
                                  {format(
                                    Date.parse(notes.createdAt),
                                    "MMM d y"
                                  )}
                                </div>
                              </div>
                              <div className="align-self-center">
                                <Button
                                  className="rounded-pill book-btn"
                                  size="sm"
                                  onClick={() => showBuyModal(notes)}
                                >
                                  Buy Now!
                                </Button>
                              </div>
                            </div>
                          )
                        })
                        .reduce((prev, curr) => [
                          prev,
                          <hr key={curr._id} />,
                          curr,
                        ])}
                    {searchResult.other.sessions.length !== 0 && (
                      <>
                        {searchResult.other.notes.length !== 0 && <hr />}
                        {searchResult.other.sessions
                          .map((user) => {
                            return (
                              <div
                                className="d-flex justify-content-between"
                                key={user._id}
                              >
                                <div
                                  className="d-flex pointer"
                                  onClick={() =>
                                    props.history.push(`/profile/${user._id}`)
                                  }
                                >
                                  <img
                                    src={user.avatar}
                                    alt=""
                                    className="rounded-circle user-img align-self-center"
                                  />
                                  <div className="ml-3">
                                    {user?.name} {user.surname} <br />
                                    <span className="medbig-txt">
                                      {user.uni?.name}, {user.uni?.location}
                                    </span>
                                    <br />
                                    Currently available for{" "}
                                    <span className="thicker green">
                                      {searchResult.subject.subject}
                                    </span>{" "}
                                    tutoring
                                  </div>
                                </div>
                                <div className="align-self-center">
                                  <Button
                                    className="rounded-pill book-btn"
                                    size="sm"
                                    onClick={() =>
                                      props.history.push(`/profile/${user._id}`)
                                    }
                                  >
                                    Check Availability
                                  </Button>
                                </div>
                              </div>
                            )
                          })
                          .reduce((prev, curr) => [
                            prev,
                            <hr key={curr._id} />,
                            curr,
                          ])}
                      </>
                    )}
                    {searchResult.other.users.length !== 0 && (
                      <>
                        {(searchResult.other.notes.length !== 0 ||
                          searchResult.other.sessions.length !== 0) && <hr />}
                        {searchResult.other.users
                          .map((user) => {
                            return (
                              <div
                                className="d-flex justify-content-between"
                                key={user._id}
                              >
                                <div
                                  className="d-flex pointer"
                                  onClick={() =>
                                    props.history.push(`/profile/${user._id}`)
                                  }
                                >
                                  <img
                                    src={user.avatar}
                                    alt=""
                                    className="rounded-circle user-img align-self-center"
                                  />
                                  <div className="ml-3">
                                    <span className="thicker green">
                                      {user?.name} {user.surname}
                                    </span>
                                    <br />
                                    Student at {user.uni?.name} <br />
                                    <span className="medbig-txt">
                                      {user.uni?.location}
                                    </span>
                                  </div>
                                </div>
                                <div className="align-self-center">
                                  <Button
                                    className="rounded-pill book-btn"
                                    size="sm"
                                    onClick={() =>
                                      props.history.push(`/profile/${user._id}`)
                                    }
                                  >
                                    Visit Profile
                                  </Button>
                                </div>
                              </div>
                            )
                          })
                          .reduce((prev, curr) => [
                            prev,
                            <hr key={curr._id} />,
                            curr,
                          ])}
                      </>
                    )}
                  </div>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default SearchResults
