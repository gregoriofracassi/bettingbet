import React from "react"
import "./styles/notesDashboard.css"
import RatingModal from "./RatingModal"
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  ButtonGroup,
  Button,
  Form,
} from "react-bootstrap"
import { useState, useEffect } from "react"
import { Download, Trash } from "react-bootstrap-icons"
import { useSelector } from "react-redux"
import { useCookies } from "react-cookie"
import "./styles/tutorDasboard.css"
import { format } from "date-fns"

const pdfThumbs = [
  "https://data2.unhcr.org/images/documents/big_4cda85d892a5c0b5dd63b510a9c83e9c9d06e739.jpg",
  "https://data2.unhcr.org/images/documents/big_ce41a5548be1a9bf770a61532e851c61188f78d6.jpg",
  "https://d20ohkaloyme4g.cloudfront.net/img/document_thumbnails/7224b60bcf88c9c6e5c89f2ff0e83b4a/thumb_1200_1553.png",
  "https://s3.studylib.net/store/data/008978189_1-4f8dcb879454b48be36acd0f1896436f.png",
  "https://i1.rgstatic.net/publication/240807798_Document_Analysis_as_a_Qualitative_Research_Method/links/59d807d0a6fdcc2aad065377/largepreview.png",
  "https://i.pinimg.com/originals/4f/f2/bb/4ff2bb2c2b90e139d9322f91cfe24803.png",
  "https://i.pinimg.com/originals/5e/e2/ac/5ee2aca88bbb057ef156063942203311.jpg",
  "https://i.pinimg.com/736x/02/46/f9/0246f94dfea3f5a637e5ac6b0c956bd4.jpg",
  "https://i.pinimg.com/originals/42/98/9f/42989f9222a2eb0a34fccf39fab7beff.png",
  "https://d1e4pidl3fu268.cloudfront.net/2404affb-f184-47a9-b11e-d817ee7a8627/Screenshot20200301at133247.crop_662x496_64,0.preview.png",
  "https://image.slidesharecdn.com/solvinglineareqwithnotes-150831181655-lva1-app6892/95/solving-linear-equations-with-notes-1-638.jpg?cb=1441045062",
  "https://physicscourses.colorado.edu/phys2020/phys2020_sp00_hidden/notes/lecture_notes/CH19/lect19-9.gif",
  "https://i.pinimg.com/originals/be/d3/36/bed336e70b47b28c7f1aeffeea46b074.jpg",
  "https://i.pinimg.com/originals/5a/0c/82/5a0c822a0a0848792491b0e55dca55df.png",
  "https://i.pinimg.com/originals/ea/90/9a/ea909afafe8c60aa2cd7d25a8f3c837b.jpg",
  "https://64.media.tumblr.com/991cd06956aebc9d21e95fd5f51f98b6/tumblr_os3ltsSWrP1wqvo1fo1_1280.jpg",
  "http://elkarthistory.weebly.com/uploads/1/4/6/6/14663994/2813016_orig.jpeg",
  "https://i.pinimg.com/originals/00/6d/b3/006db3a00cdcaad9cd28df32368157be.jpg",
  "https://data2.unhcr.org/images/documents/big_38e05a12d250124514c6a4c0669cb5cca786e5e7.jpg",
  "https://data2.unhcr.org/images/documents/big_cbcb7422e944284b38baefec574c6b7250a3715b.jpg",
  "https://data2.unhcr.org/images/documents/big_280b97c394ca4e52852804076f9d094b8f138c90.jpg",
  "https://data2.unhcr.org/images/documents/big_1bcf8561c8cb1e044c0e19eebc4722a99b94c7dc.jpg",
]

const NotesDashboard = (props) => {
  const [randomThumb, setRandomThumb] = useState("")
  const [rateModal, setRateModal] = useState(false)
  const [ratingComplete, setRatingComplete] = useState(false)
  const [notesToRate, setNotesToRate] = useState({
    author: { name: "", surname: "" },
    subject: { subject: "" },
  })
  const [uploadedNotes, setUploadedNotes] = useState([
    {
      _id: "",
      image: "",
      createdAt: new Date(),
      subject: { subject: "" },
      author: { name: "", surname: "" },
    },
  ])
  const [purchasedNotes, setPurchasedNotes] = useState([
    {
      _id: "",
      image: "",
      createdAt: new Date(),
      subject: { subject: "" },
      author: { name: "", surname: "" },
    },
  ])
  const [cookies] = useCookies(["accessToken"])
  const [radioValue, setRadioValue] = useState("Purchased")
  const loggedUser = useSelector((state) => state.loggedUser)
  const [selectedCourse, setSelectedCourse] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [uploadFile, setUploadFile] = useState(null)
  const [refresh, setRefresh] = useState(false)
  const [price, setPrice] = useState("")

  const radios = [
    { name: "Purchased", value: "Purchased" },
    { name: "Uploaded", value: "Uploaded" },
  ]

  useEffect(() => {
    setRandomThumb(pdfThumbs[Math.floor(Math.random() * pdfThumbs.length)])
    setSelectedCourse(loggedUser.course._id)
    setSelectedSubject(loggedUser.course.subjects[0]._id)
    const getNotes = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL}/notes/byAuthor/${loggedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${cookies.token}`,
            },
          }
        )
        if (response.ok) {
          const notes = await response.json()
          setUploadedNotes(notes)
          try {
            const newResponse = await fetch(
              `${process.env.REACT_APP_URL}/notes/byPurchaser/${loggedUser._id}`,
              {
                headers: {
                  Authorization: `Bearer ${cookies.token}`,
                },
              }
            )
            if (newResponse.ok) {
              const boughtNotes = await newResponse.json()
              setPurchasedNotes(boughtNotes)
              console.log("boughtnotes", boughtNotes)
            }
          } catch (error) {
            console.log(error)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
    getNotes()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUser, refresh])

  const selectFile = (e) => {
    e.preventDefault()
    const file = e.target.files[0]
    let formData = new FormData()
    formData.append("image", file)
    setUploadFile(formData)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/notes/upload`,
        {
          method: "POST",
          body: uploadFile,
        }
      )
      if (response.ok) {
        const { key } = await response.json()
        let newResponse = await fetch(`${process.env.REACT_APP_URL}/notes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.token}`,
          },
          body: JSON.stringify({
            course: selectedCourse,
            subject: selectedSubject,
            contentKey: key,
            price: parseInt(price),
            image: randomThumb,
          }),
        })
        if (newResponse.ok) {
          console.log("File uploaded successfully")
          setRefresh(!refresh)
        }
      }
    } catch (error) {
      console.log(`Something went wrong! ${error}`)
    }
  }

  const deleteNotes = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${cookies.token}`,
        },
      })
      if (response.ok) {
        console.log("deleted notes")
      }
    } catch (error) {
      console.log(error)
    }
    setRefresh(!refresh)
  }

  const showRateModal = (notes) => {
    setRateModal(true)
    setNotesToRate(notes)
  }
  const closeRateModal = () => {
    setRateModal(false)
    if (ratingComplete) {
      setRatingComplete(false)
    }
  }

  return (
    <>
      <RatingModal
        modalType="notes"
        toRate={notesToRate}
        ratingComplete={ratingComplete}
        show={rateModal}
        closeRateModal={closeRateModal}
      />
      <Container className="mb-4">
        <Row>
          <Col md={8}>
            <Card className="grey-bg">
              <Card.Body className="d-flex align-items-center justify-content-between">
                <h5 className="my-0 mr-3 thicker font-italic grey">
                  {loggedUser.name}'s Notes
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
            <Row className="mt-3">
              {radioValue === "Uploaded" &&
                (uploadedNotes.length === 0 ? (
                  <Col md={12} className="mt-2">
                    You have not uploaded any notes yet...
                  </Col>
                ) : (
                  uploadedNotes.map((notes) => {
                    return (
                      <Col md={6} className="transition" key={notes._id}>
                        <Card className="px-0 my-1">
                          <Card.Body className="p-0">
                            <div className="d-flex justify-content-between py-2 px-3 medbig-txt">
                              <div className="d-flex align-items-center">
                                <div>
                                  <img
                                    className="img-fluid pdf-logo mr-2"
                                    src={notes.image}
                                    alt=""
                                  />
                                </div>
                                <div className="align-self-center">
                                  <span className="lg-txt thicker green">
                                    {notes.subject.subject}
                                  </span>{" "}
                                  Notes
                                  <br />
                                  Posted{" "}
                                  {format(
                                    Date.parse(notes.createdAt),
                                    "MMM d y"
                                  )}
                                </div>
                              </div>
                              <div className="align-self-center">
                                <Trash onClick={() => deleteNotes(notes._id)} />
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    )
                  })
                ))}
              {radioValue === "Purchased" &&
                (purchasedNotes.length === 0 ? (
                  <Col md={12}>You have not purchased any notes yet...</Col>
                ) : (
                  purchasedNotes.map((notes) => {
                    return (
                      <Col md={6} key={notes._id}>
                        <Card className="px-0 my-1">
                          <Card.Body className="p-0">
                            <div className="d-flex justify-content-between py-2 px-3 medbig-txt">
                              <div className="d-flex align-items-center">
                                <div>
                                  <img
                                    className="img-fluid pdf-logo mr-2"
                                    src={notes.image}
                                    alt=""
                                  />
                                </div>
                                <div className="align-self-center">
                                  <span className="lg-txt thicker green">
                                    {notes.subject.subject}
                                  </span>{" "}
                                  Notes
                                  <br />
                                  by {notes.author.name} {notes.author.surname}
                                  <br />
                                  Posted{" "}
                                  {format(
                                    Date.parse(notes.createdAt),
                                    "MMM d y"
                                  )}
                                </div>
                              </div>
                              <div className="align-self-center">
                                <div className="d-flex align-items-center">
                                  <div
                                    onClick={() => showRateModal(notes)}
                                    className="thicker pointer grey"
                                  >
                                    Rate
                                  </div>
                                  <Download className="ml-2" />
                                </div>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    )
                  })
                ))}
            </Row>
          </Col>
          <Col md={4}>
            <ListGroup>
              <ListGroup.Item className="grey-bg">
                <div className="font-italic thicker grey lg-txt">Add notes</div>
                <div className="d-flex my-2">
                  <div className="align-self-center mr-3 med-txt grey">
                    Course
                  </div>
                  <Form.Control
                    size="sm"
                    as="select"
                    value={selectedCourse}
                    onChange={(e) => {
                      setSelectedCourse(e.target.value)
                    }}
                  >
                    <option value={loggedUser.course._id}>
                      {loggedUser.course.course}
                    </option>
                  </Form.Control>
                </div>
                <div className="d-flex my-2">
                  <div className="align-self-center mr-3 med-txt grey">
                    Subject
                  </div>
                  <Form.Control
                    size="sm"
                    as="select"
                    value={selectedSubject}
                    onChange={(e) => {
                      setSelectedSubject(e.target.value)
                    }}
                  >
                    {loggedUser.course.subjects.map((subj) => {
                      return (
                        <option key={subj._id} value={subj._id}>
                          {subj.subject}
                        </option>
                      )
                    })}
                  </Form.Control>
                </div>
                <div className="d-flex my-2">
                  <div className="align-self-center mr-3 med-txt grey">
                    Price(€)
                  </div>
                  <Form.Control
                    size="sm"
                    type="text"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value)
                    }}
                  ></Form.Control>
                </div>
                <Form.Group controlId="formFile" className="mt-3">
                  <Form.Control
                    size="sm"
                    type="file"
                    onChange={selectFile}
                    className="file-input"
                  />
                </Form.Group>
                <div className="d-flex justify-content-center my-3">
                  <Button
                    className="rounded-pill book-btn"
                    onClick={handleSubmit}
                  >
                    Upload
                  </Button>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default NotesDashboard
