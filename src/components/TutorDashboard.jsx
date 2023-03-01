import React from "react"
import { CameraVideo } from "react-bootstrap-icons"
import "./styles/tutorDasboard.css"
import {
  Container,
  Row,
  Col,
  ButtonGroup,
  Button,
  Card,
  ListGroup,
  Form,
} from "react-bootstrap"
import { useState, useEffect } from "react"
import { Trash } from "react-bootstrap-icons"
import { useSelector } from "react-redux"
import { useCookies } from "react-cookie"
import {
  add,
  format,
  eachMonthOfInterval,
  eachYearOfInterval,
  eachHourOfInterval,
  isEqual,
} from "date-fns"
import { withRouter } from "react-router"

const TutorDashboard = (props) => {
  const [tutorSessions, setTutorSessions] = useState([])
  const [studentSessions, setStudentSessions] = useState([])
  const [unbookedAvail, setUnbookedAvail] = useState([])
  const [cookies] = useCookies(["token"])
  const [radioValue, setRadioValue] = useState("Tutor")
  const [selectedMonth, setSelectedMonth] = useState(format(Date.now(), "MMM"))
  const [selectedYear, setSelectedYear] = useState(format(Date.now(), "y"))
  const [selectedDay, setSelectedDay] = useState(1)
  const [selectedHour, setSelectedHour] = useState(format(Date.now(), "HH"))
  const [selectedMin, setSelectedMin] = useState("00")
  const [refresh, setRefresh] = useState(false)

  const loggedUser = useSelector((state) => state.loggedUser)

  const radios = [
    { name: "Student", value: "Student" },
    { name: "Tutor", value: "Tutor" },
    { name: "History", value: "History" },
  ]

  const createTutorAvail = async () => {
    const selectedDate = new Date(
      `${selectedMonth} ${selectedDay}, ${selectedYear} ${selectedHour}:${selectedMin}`
    )
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
            startTime: selectedDate,
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

  useEffect(() => {
    const getSessions = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL}/tutorSessions/byTutor/${loggedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${cookies.token}`,
            },
          }
        )
        if (response.ok) {
          const tutorSess = await response.json()
          setUnbookedAvail(tutorSess.filter((sess) => !sess.student))
          const tutorSessUnfiltered = tutorSess.filter((sess) => sess.student)
          const mappedTimeStamps = tutorSessUnfiltered.map((sess) =>
            add(Date.parse(sess.startTime), { minutes: 30 })
          )
          const filteredTut = tutorSessUnfiltered.filter(
            (sess) =>
              !mappedTimeStamps.find((time) =>
                isEqual(time, Date.parse(sess.startTime))
              )
          )
          setTutorSessions(filteredTut)
          try {
            const response = await fetch(
              `${process.env.REACT_APP_URL}/tutorSessions/byStudent/${loggedUser._id}`,
              {
                headers: {
                  Authorization: `Bearer ${cookies.token}`,
                },
              }
            )
            if (response.ok) {
              const studentSess = await response.json()
              const mappedTimes = studentSess.map((sess) =>
                add(Date.parse(sess.startTime), { minutes: 30 })
              )
              const filtered = studentSess.filter(
                (sess) =>
                  !mappedTimes.find((time) =>
                    isEqual(time, Date.parse(sess.startTime))
                  )
              )
              setStudentSessions(filtered)
            }
          } catch (error) {
            console.log(error)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
    getSessions()
  }, [loggedUser, cookies.token, refresh])

  return (
    <Container>
      <Row>
        <Col md={8}>
          <Card>
            <Card.Body className="d-flex align-items-center justify-content-between grey-bg">
              <h5 className="my-0 mr-3 thicker grey font-italic">
                {loggedUser.name}'s Tutoring Sessions
              </h5>
              <ButtonGroup>
                {radios.map((radio, idx) => (
                  <Button
                    className="rounded-pill mr-1 book-btn"
                    size="sm"
                    key={idx}
                    variant="outline-primary"
                    name="radio"
                    value={radio.value}
                    active={radioValue === radio.value}
                    onClick={(e) => setRadioValue(e.currentTarget.value)}
                  >
                    {radio.name}
                  </Button>
                ))}
              </ButtonGroup>
            </Card.Body>
          </Card>
          <ListGroup className="mt-3">
            {radioValue === "Student" &&
              (studentSessions.length === 0 ? (
                <div className="mt-2">
                  You don't have any booked upcoming sessions as student...
                </div>
              ) : (
                studentSessions.map((sess) => {
                  return (
                    <div key={sess._id}>
                      <ListGroup.Item className="mb-2">
                        <div className="d-flex align-items-center justify-content-between medbig-txt">
                          <div className="d-flex align-items-center">
                            <img
                              className="small-avatar mr-3"
                              src={sess.tutor.avatar}
                              alt=""
                            />
                            <div>
                              with{" "}
                              <span className="thicker green pointer lg-txt">
                                {sess.tutor.name} {sess.tutor.surname}
                              </span>
                              <br />
                              <span className="font-italic thicker">
                                Tutor
                              </span>{" "}
                              from {sess.tutor.uni.name},{" "}
                              {sess.tutor.uni.location}
                              <br />
                              {format(
                                Date.parse(sess.startTime),
                                "MMMM d y"
                              )}, {format(Date.parse(sess.startTime), "H:mm")} -{" "}
                              {sess.duration}
                            </div>
                          </div>
                          <div>
                            <Button
                              className="book-btn"
                              onClick={() =>
                                props.history.push(`/mySessions/${sess._id}`)
                              }
                            >
                              <CameraVideo className="mr-2" />
                              Join
                            </Button>
                          </div>
                        </div>
                      </ListGroup.Item>
                    </div>
                  )
                })
              ))}
            {radioValue === "Tutor" &&
              (tutorSessions.length === 0 ? (
                <div className="mt-2">
                  You don't have any booked upcoming sessions as tutor...
                </div>
              ) : (
                tutorSessions.map((sess) => {
                  return (
                    <div key={sess._id}>
                      <ListGroup.Item className="mb-2">
                        <div className="d-flex align-items-center justify-content-between medbig-txt">
                          <div className="d-flex align-items-center">
                            <img
                              className="small-avatar mr-3"
                              src={sess.student.avatar}
                              alt=""
                            />
                            <div>
                              with{" "}
                              <span className="thicker green pointer lg-txt">
                                {sess.student.name} {sess.student.surname}
                              </span>
                              <br />
                              <span className="font-italic thicker">
                                Student
                              </span>{" "}
                              from {sess.student.uni.name},{" "}
                              {sess.student.uni.location}
                              <br />
                              {format(
                                Date.parse(sess.startTime),
                                "MMMM d y"
                              )}, {format(Date.parse(sess.startTime), "H:mm")} -{" "}
                              {sess.duration}
                            </div>
                          </div>
                          <div>
                            <Button
                              className="book-btn"
                              onClick={() =>
                                props.history.push(`/mySessions/${sess._id}`)
                              }
                            >
                              <CameraVideo className="mr-2" />
                              Join
                            </Button>
                          </div>
                        </div>
                      </ListGroup.Item>
                    </div>
                  )
                })
              ))}
          </ListGroup>
        </Col>
        <Col md={4}>
          <ListGroup>
            <ListGroup.Item className="grey-bg">
              <div className="font-italic thicker grey lg-txt">
                Add a 30m slot
              </div>
              <div className="d-flex my-2">
                <div className="align-self-center mr-3 med-txt grey">Date:</div>
                <Form.Control
                  size="sm"
                  as="select"
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value)
                  }}
                >
                  {eachMonthOfInterval({
                    start: Date.now(),
                    end: add(Date.now(), { months: 11 }),
                  }).map((month) => {
                    return (
                      <option
                        key={format(month, "MMM")}
                        value={format(month, "MMM")}
                      >
                        {format(month, "MMM")}
                      </option>
                    )
                  })}
                </Form.Control>
                <Form.Control
                  className="mx-2"
                  size="sm"
                  as="select"
                  value={selectedDay}
                  onChange={(e) => {
                    setSelectedDay(e.target.value)
                  }}
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    return (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    )
                  })}
                </Form.Control>
                <Form.Control
                  size="sm"
                  as="select"
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value)
                  }}
                >
                  {eachYearOfInterval({
                    start: Date.now(),
                    end: add(Date.now(), { years: 5 }),
                  }).map((year) => {
                    return (
                      <option key={format(year, "y")} value={format(year, "y")}>
                        {format(year, "y")}
                      </option>
                    )
                  })}
                </Form.Control>
              </div>
              <div className="d-flex">
                <div className="mr-2 align-self-center text-nowrap med-txt grey">
                  Starting time:
                </div>
                <Form.Control
                  size="sm"
                  as="select"
                  value={selectedHour}
                  onChange={(e) => {
                    setSelectedHour(e.target.value)
                  }}
                >
                  {eachHourOfInterval({
                    start: Date.now(),
                    end: add(Date.now(), { hours: 23 }),
                  }).map((hour) => {
                    return (
                      <option
                        key={format(hour, "HH")}
                        value={format(hour, "HH")}
                      >
                        {format(hour, "HH")}
                      </option>
                    )
                  })}
                </Form.Control>
                <Form.Control
                  size="sm"
                  className="ml-2"
                  as="select"
                  value={selectedMin}
                  onChange={(e) => {
                    setSelectedMin(e.target.value)
                  }}
                >
                  {["00", "30"].map((min) => {
                    return (
                      <option key={min} value={min}>
                        {min}
                      </option>
                    )
                  })}
                </Form.Control>
              </div>
              <div className="d-flex justify-content-center my-3">
                <Button
                  className="rounded-pill book-btn"
                  onClick={createTutorAvail}
                >
                  Add slot
                </Button>
              </div>
            </ListGroup.Item>
            <ListGroup.Item className="grey-bg">
              <div className="thicker grey lg-txt font-italic mb-2">
                Future unbooked slots
              </div>
              <ListGroup className="scrollable">
                {unbookedAvail.map((av) => {
                  return (
                    <ListGroup.Item key={av._id}>
                      <div className="d-flex justify-content-between medbig-txt">
                        <div>
                          {format(Date.parse(av.startTime), "MMM d, y - HH:mm")}
                        </div>
                        <div>
                          <Trash
                            className="pointer"
                            onClick={() => deleteAvail(av._id)}
                          />
                        </div>
                      </div>
                    </ListGroup.Item>
                  )
                })}
              </ListGroup>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </Container>
  )
}

export default withRouter(TutorDashboard)
