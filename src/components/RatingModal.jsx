import React from "react"
import ReactStars from "react-rating-stars-component"
import { useCookies } from "react-cookie"
import { useState } from "react"
import { Modal, Button } from "react-bootstrap"
import { Circle, CircleFill } from "react-bootstrap-icons"

const RatingModal = (props) => {
  const [cookies] = useCookies(["token"])
  const [rating, setRating] = useState(0)
  const [ratingComplete, setRatingComplete] = useState(props.ratingComplete)

  const ratingDots = {
    size: 20,
    count: 5,
    color: "#069954",
    activeColor: "#069954",
    value: 7.5,
    a11y: true,
    isHalf: false,
    emptyIcon: <Circle className="mx-1" />,
    filledIcon: <CircleFill className="mx-1" />,
    onChange: (newValue) => {
      setRating(newValue)
    },
  }

  const rateNotes = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/users/rateNotes/${props.toRate.author._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.token}`,
          },
          body: JSON.stringify({
            rating: rating,
          }),
        }
      )
      if (response.ok) {
        const data = await response.json()
        console.log(data)
        setRatingComplete(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const rateTutor = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/users/rateTutor/${props.toRate.tutor._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookies.token}`,
          },
          body: JSON.stringify({
            rating: rating,
          }),
        }
      )
      if (response.ok) {
        const data = await response.json()
        console.log(data)
        setRatingComplete(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Modal show={props.show} onHide={props.closeRateModal} centered>
      <Modal.Body className="py-4">
        {ratingComplete
          ? "Thank you!"
          : props.modalType === "tutor" && (
              <>
                How would you rate {props.toRate.tutor.name}{" "}
                {props.toRate.tutor.surname}
                's {props.toRate.subject.subject} tutoring?
                <br />
                <div className="d-flex justify-content-center p-4">
                  <ReactStars {...ratingDots} />
                </div>
              </>
            )}
        {ratingComplete
          ? console.log("notes rated")
          : props.modalType === "notes" && (
              <>
                How would you rate {props.toRate.author.name}{" "}
                {props.toRate.author.surname}
                's {props.toRate.subject.subject} notes?
                <br />
                <div className="d-flex justify-content-center p-4">
                  <ReactStars {...ratingDots} />
                </div>
              </>
            )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="success"
          onClick={props.modalType === "notes" ? rateNotes : rateTutor}
          size="sm"
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default RatingModal
