import React from "react"
import { useSelector } from "react-redux"
import UserCard from "./UserCard"
import { useCookies } from "react-cookie"
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Tabs,
  Tab,
  Button,
  Modal,
  Form,
  ProgressBar,
} from "react-bootstrap"
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons"
import "./styles/profile.css"
import { useState, useEffect } from "react"
import {
  eachDayOfInterval,
  eachHourOfInterval,
  add,
  set,
  setDay,
  format,
} from "date-fns"
import PeopleList from "./PeopleList"

const Profile = (props) => {
  const [loading, setLoading] = useState(false)
  const [purchaseCompleted, setPurchaseCompleted] = useState(false)
  const [availabilities, setAvailabilities] = useState([])
  const [userId, setUserId] = useState(props.match.params.id)
  const [refresh, setRefresh] = useState(false)
  const [currWeek, setCurrWeek] = useState([])
  const [currWeekHalfHours, setCurrWeekHalfHours] = useState([[]])
  const [preBookAvail, setPreBookAvail] = useState([])
  const [weekAdder, setWeekAdder] = useState(0)
  const [show, setShow] = useState(false)
  const [buyModal, setBuyModal] = useState(false)
  const [notesToBuy, setNotesToBuy] = useState({
    author: { name: "", surname: "" },
    price: 0,
    subject: { subject: "" },
  })
  const [cookies] = useCookies(["accessToken"])
  const [notes, setNotes] = useState([
    {
      image: "",
      createdAt: new Date(),
      subject: { subject: "" },
      price: 0,
      _id: "",
    },
  ])
  const [selectedSubject, setSelectedSubject] = useState("")
  const loggedUser = useSelector((state) => state.loggedUser)
  const [user, setUser] = useState({
    uni: { name: "", location: "" },
    course: { course: "" },
    availableSubjects: [{ _id: "", subject: "" }],
    comments: [
      {
        _id: "",
        content: "",
        author: [
          {
            name: "",
            surname: "",
            avatar: "",
          },
        ],
      },
    ],
    notesRatings: [0],
    tutorRatings: [0],
    hourlyFee: 0,
  })

  const handleClose = () => {
    setShow(false)
    if (purchaseCompleted) {
      setPurchaseCompleted(false)
    }
  }
  const handleShow = () => setShow(true)

  // ------------calendar functions------------

  const createTutorAvail = async (hh) => {
    const startTime = Date.parse(hh)
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/tutorSessions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.token}`,
          },
          body: JSON.stringify({
            startTime: startTime,
            course: loggedUser.course,
            uni: loggedUser.uni,
          }),
        }
      )
      if (response.ok) {
        console.log("created new tutor availability")
        setRefresh(!refresh)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteAvail = async (id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/tutorSessions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${cookies.token}`,
          },
        }
      )
      if (response.ok) {
        console.log("Deleted availability")
        setRefresh(!refresh)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const cellBorder = (hh, i) => {
    let classNaming = ""
    if (i === 0) {
      classNaming = "calendar-cell-1"
    } else if (i % 2 !== 0 && i !== 0) {
      classNaming = "calendar-cell-dark"
    } else {
      classNaming = "calendar-cell"
    }
    return classNaming
  }

  const cellHighlight = (hh) => {
    const inAvailabilities = availabilities.find(
      (av) => Date.parse(av.startTime) === Date.parse(hh)
    )
    if (inAvailabilities) {
      if (preBookAvail.find((av) => av === hh)) {
        return "av-highlight"
      } else {
        if (inAvailabilities.student) {
          return "av-grey not-allowed"
        } else {
          return "av-green"
        }
      }
    }
  }

  const getCurrWeek = () => {
    const startDate = add(setDay(new Date(), 1), { weeks: weekAdder })
    const endDate = add(startDate, { days: 6 })
    const week = eachDayOfInterval({
      start: startDate,
      end: endDate,
    })
    return week
  }

  const getHalfHours = () => {
    const halfHoursOfWeek = []
    getCurrWeek().forEach((day) => {
      const halfHoursOfDay = []
      const startTime = set(day, { hours: 8 })
      const endTime = set(day, { hours: 23 })
      const hoursOfDay = eachHourOfInterval({
        start: startTime,
        end: endTime,
      })
      hoursOfDay.forEach((h) => {
        halfHoursOfDay.push(h)
        halfHoursOfDay.push(add(h, { minutes: 30 }))
      })
      halfHoursOfWeek.push(halfHoursOfDay)
    })
    return halfHoursOfWeek
  }

  const bookAvailability = (hh) => {
    if (user._id === loggedUser._id) {
      if (
        availabilities.find((av) => Date.parse(av.startTime) === Date.parse(hh))
      ) {
        const foundAvail = availabilities.find(
          (av) => Date.parse(av.startTime) === Date.parse(hh)
        )
        if (foundAvail.student) {
          console.log("already booked")
        } else {
          deleteAvail(foundAvail._id)
        }
      } else {
        createTutorAvail(hh)
      }
    } else {
      const found = availabilities.find(
        (av) => Date.parse(av.startTime) === Date.parse(hh)
      )
      if (found && !found.student) {
        if (preBookAvail.includes(hh)) {
          const copyArray = [...preBookAvail]
          setPreBookAvail(copyArray.filter((av) => av !== hh))
        } else {
          setPreBookAvail([...preBookAvail, hh])
        }
      }
    }
  }

  useEffect(() => {
    setCurrWeek(getCurrWeek())
    setCurrWeekHalfHours(getHalfHours())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekAdder])

  const loadingInterval = () => {
    setTimeout(() => {
      setLoading(false)
      setPurchaseCompleted(true)
    }, 2000)
  }

  const availToBook = () => {
    const availToBook = []
    preBookAvail.forEach((preBook) => {
      const match = availabilities.find(
        (av) => Date.parse(av.startTime) === Date.parse(preBook)
      )
      availToBook.push(match)
    })
    setLoading(true)
    loadingInterval()
    return availToBook.map((av) => av._id)
  }

  const handleSubmit = () => {
    const availabToBook = availToBook()
    availabToBook.forEach(async (av) => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL}/tutorSessions/book/${av}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${cookies.token}`,
            },
            body: JSON.stringify({
              subject: selectedSubject,
              duration: availabToBook.length,
            }),
          }
        )
        if (response.ok) {
          console.log("tutor sessions updated with student")
          setPreBookAvail([])
          setRefresh(!refresh)
        }
      } catch (error) {
        console.log(error)
      }
    })
  }
  // ------------end of calendar functions-----------

  // ----------notes functions----------

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
    setLoading(true)
    loadingInterval()
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

  const arrayAvg = (arr) => {
    const avg =
      arr.length !== 0
        ? (arr.reduce((pre, curr) => pre + curr, 0) / arr.length) * 20
        : 50
    return avg
  }

  // -----------end of notes functions---------

  useEffect(() => {
    const userChange = () => {
      setUserId(props.match.params.id)
    }
    userChange()
  }, [props.match.params.id])

  useEffect(() => {
    console.log("reexecuting useeffect profile")
    const getData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL}/users/specific/${userId}`
        )
        if (response.ok) {
          const data = await response.json()
          setUser(data)
        }
      } catch (error) {
        console.log(error)
      }
    }

    const getNotes = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL}/notes/byAuthor/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${cookies.token}`,
            },
          }
        )
        if (response.ok) {
          const notes = await response.json()
          setNotes(notes)
        }
      } catch (error) {
        console.log(error)
      }
    }

    const getAvailabilities = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL}/tutorSessions/byTutor/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${cookies.token}`,
            },
          }
        )
        if (response.ok) {
          const data = await response.json()
          setAvailabilities(data)
        }
      } catch (error) {
        console.log(error)
      }
    }

    getData()
    getNotes()
    getAvailabilities()
    setCurrWeek(getCurrWeek())
    setCurrWeekHalfHours(getHalfHours())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, refresh])

  return (
    <>
      <Modal show={buyModal} onHide={closeBuyModal} centered>
        <Modal.Body className="py-4">
          {purchaseCompleted && !loading && (
            <>
              Purchase Successful! <br />
              You can download now, or else you'll find 'em in your console
            </>
          )}
          {!purchaseCompleted && !loading && (
            <>
              Do you wish to procced with the purchase of{" "}
              {notesToBuy.author.name} {notesToBuy.author.surname}'s{" "}
              <span className="thicker green">
                {notesToBuy.subject.subject}
              </span>{" "}
              notes? <br />
              <div className="thicker grey font-italic mt-2">
                Total: €{notesToBuy.price}
              </div>
            </>
          )}
          {loading && (
            <>
              <div className="d-flex justify-content-center py-2">
                <div className="spinner-border text-success" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
              <div className="d-flex justify-content-center pb-2">
                Processing payment...
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={purchaseCompleted ? downloadNotes : buyNotes}
            size="sm"
          >
            {purchaseCompleted ? "Download now" : "Confirm"}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body className="p-4">
          {!purchaseCompleted &&
            !loading &&
            preBookAvail.length === 0 &&
            "Please select one or more available slots"}
          {!purchaseCompleted && !loading && preBookAvail.length !== 0 && (
            <>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm="4">
                  Select a subject
                </Form.Label>
                <Col sm="8" className="pl-0">
                  <Form.Control
                    as="select"
                    value={selectedSubject}
                    onChange={(e) => {
                      setSelectedSubject(e.target.value)
                    }}
                  >
                    <option value="" disabled defaultValue>
                      Select your option
                    </option>
                    {user.availableSubjects.map((av) => {
                      return (
                        <option key={av._id} value={av._id}>
                          {av.subject}
                        </option>
                      )
                    })}
                  </Form.Control>
                </Col>
              </Form.Group>
              <div className="mb-0 mt-3 thicker grey font-italic">
                Total: €{" "}
                {((preBookAvail.length * user.hourlyFee) / 2).toFixed(2)}
              </div>
              <div className="mb-0 mt-2">
                Would you like to book the selected slots?
              </div>
            </>
          )}
          {loading && (
            <>
              <div className="d-flex justify-content-center py-2">
                <div className="spinner-border text-success" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
              <div className="d-flex justify-content-center pb-2">
                Processing payment...
              </div>
            </>
          )}
          {purchaseCompleted && (
            <>
              Purchase successful!
              <br />
              Check your Console to join the session
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            onClick={
              preBookAvail.length !== 0 ? handleSubmit : console.log("hey")
            }
            size="sm"
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      <Container>
        <Row>
          <Col md={3}>
            <UserCard user={user} />
            <Card className="mt-3">
              <Card.Header className="grey-bg">Ratings</Card.Header>
              <Card.Body>
                <div>
                  <ProgressBar
                    striped
                    variant="success"
                    now={arrayAvg(user.notesRatings)}
                  />
                  <div className="d-flex justify-content-between medsm-txt mb-2">
                    <div>
                      <span className="mr-1 thicker green">Notes</span>
                      {user.notesRatings.length} votes
                    </div>
                    <div>
                      {user.notesRatings.length !== 0
                        ? `${(arrayAvg(user.notesRatings) / 20).toFixed(1)} / 5`
                        : "--/--"}
                    </div>
                  </div>
                  <ProgressBar
                    striped
                    variant="success"
                    now={arrayAvg(user.tutorRatings)}
                  />
                  <div className="d-flex justify-content-between medsm-txt mb-2">
                    <div>
                      <span className="mr-1 thicker green">Tutor</span>{" "}
                      {user.tutorRatings.length} votes
                    </div>
                    <div>
                      {user.tutorRatings.length !== 0
                        ? `${(arrayAvg(user.tutorRatings) / 20).toFixed(1)} / 5`
                        : "--/--"}
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
            <Card className="mt-3">
              <ListGroup variant="flush">
                <ListGroup.Item className="grey-bg">About me</ListGroup.Item>
                <ListGroup.Item>{user.about}</ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
          <Col md={6}>
            <Tabs
              defaultActiveKey="profile"
              id="uncontrolled-tab-example"
              className="tab-title"
            >
              <Tab eventKey="home" title="Notes">
                <Row>
                  {notes.map((notes) => {
                    return (
                      <Col md={6} className="p-3" key={notes._id}>
                        <Card>
                          <div
                            style={{
                              backgroundImage: `url(${notes.image})`,
                            }}
                            className="img-size"
                          ></div>
                          <Card.Body className="medbig-txt">
                            <div className="lg-txt thicker green">
                              {notes.subject.subject} notes
                            </div>
                            <div>
                              Posted on{" "}
                              {format(
                                Date.parse(notes.createdAt),
                                "MMMM do yyyy"
                              )}{" "}
                              <br />
                              <span className="lg-txt thicker">
                                Price: € {notes.price}
                              </span>
                            </div>
                            {loggedUser._id !== user._id && (
                              <Button
                                onClick={() => showBuyModal(notes)}
                                className="book-btn rounded-pill mt-3"
                              >
                                Buy now
                              </Button>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                    )
                  })}
                </Row>
              </Tab>
              <Tab eventKey="profile" title="Availabilities">
                {/* ------------------ calendar navbar -------------------------- */}
                <Container className="small-txt mb-2 shadow-b pb-3">
                  {/* -------------- book availabilities --------------- */}
                  <div className="d-flex justify-content-between py-2">
                    <div className="med-txt align-self-center">
                      {user._id === loggedUser._id
                        ? `You are`
                        : `${user.name} is`}{" "}
                      currently available for:{" "}
                      {user.availableSubjects.length !== 0 &&
                        user.availableSubjects
                          .map((av) => (
                            <span
                              className="green thicker pointer"
                              key={av._id}
                            >
                              {av.subject}
                            </span>
                          ))
                          .reduce((prev, curr) => [prev, ", ", curr], [])}
                    </div>

                    <div className="py-3 align-self-center btn-width">
                      {loggedUser._id !== user._id ? (
                        <Button
                          className="float-right book-btn rounded-pill"
                          onClick={handleShow}
                          variant="outline-primary"
                        >
                          Book a 1v1
                        </Button>
                      ) : (
                        <div className="medbig-txt pointer text-right py-2 grey">
                          Edit subjects
                        </div>
                      )}
                    </div>
                  </div>
                  <hr className="mt-0 mb-4" />
                  {/* -------------------- week days --------------------- */}
                  <Row>
                    <Col md={6}>
                      <Row>
                        <Col md={3}>
                          <Row>
                            <Col
                              md={6}
                              onClick={() => setWeekAdder(weekAdder - 1)}
                              className="pointer"
                            >
                              <ChevronLeft />
                            </Col>
                            <Col
                              md={6}
                              onClick={() => setWeekAdder(weekAdder + 1)}
                              className="pointer"
                            >
                              <ChevronRight />
                            </Col>
                          </Row>
                        </Col>
                        {currWeek.slice(0, 3).map((day) => {
                          return (
                            <Col md={3} key={day} className="default-cur">
                              {format(day, "LLL d") ===
                              format(Date.now(), "LLL d") ? (
                                <div className="orange">
                                  {format(day, "eee")} <br />{" "}
                                  {format(day, "LLL d")}
                                </div>
                              ) : (
                                <div>
                                  {format(day, "eee")} <br />{" "}
                                  {format(day, "LLL d")}
                                </div>
                              )}
                            </Col>
                          )
                        })}
                      </Row>
                    </Col>
                    <Col md={6}>
                      <Row>
                        {currWeek.slice(3).map((day) => {
                          return (
                            <Col md={3} key={day} className="default-cur">
                              {format(day, "LLL d") ===
                              format(Date.now(), "LLL d") ? (
                                <div className="orange">
                                  {format(day, "eee")} <br />{" "}
                                  {format(day, "LLL d")}
                                </div>
                              ) : (
                                <div>
                                  {format(day, "eee")} <br />{" "}
                                  {format(day, "LLL d")}
                                </div>
                              )}
                            </Col>
                          )
                        })}
                      </Row>
                    </Col>
                  </Row>
                </Container>

                {/* ------------------- calendar body ------------------------- */}
                {/* ------------- timestamps ------------- */}
                <div className="calendar">
                  <div className="eighth small-txt">
                    {currWeekHalfHours[0].map((hh, i) => {
                      return (
                        <div
                          key={i}
                          className={`vertical-space text-right default-cur pr-4 ${
                            i % 2 !== 0 && "invisible"
                          }`}
                        >
                          {format(hh, "H:mm")}
                        </div>
                      )
                    })}
                  </div>
                  {/* ------------- half hour cells ------------ */}
                  {currWeekHalfHours.map((day) => {
                    return (
                      <div className="eighth mt-2 column-highlight" key={day}>
                        {day.map((hh, i) => {
                          return (
                            <div
                              key={i}
                              className={`pointer ${cellBorder(
                                hh,
                                i
                              )} ${cellHighlight(hh)}`}
                              onClick={() => bookAvailability(hh)}
                            ></div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>
              </Tab>
              <Tab eventKey="contact" title="Comments">
                {user.comments.map((comment) => {
                  return (
                    <Card className="mt-3" key={comment._id}>
                      <Card.Body className="font-italic">
                        {comment.content}
                      </Card.Body>
                      <Card.Footer className="d-flex justify-content-between grey-bg">
                        <div className="medbig-txt d-flex align-items-center">
                          <div>
                            <img
                              src={comment.author[0].avatar}
                              alt=""
                              className="comment-img rounded-circle mr-3"
                            />
                          </div>
                          <div className="thicker green pointer">
                            {comment.author[0].name} {comment.author[0].surname}
                          </div>
                        </div>
                        <div className="medbig-txt align-self-center grey">
                          Posted Oct 18th
                        </div>
                      </Card.Footer>
                    </Card>
                  )
                })}
                <div className="d-flex justify-content-end grey medbig-txt pointer mt-3 px-2">
                  + Add Comment
                </div>
              </Tab>
            </Tabs>
          </Col>
          <Col md={3}>
            <PeopleList />
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Profile
