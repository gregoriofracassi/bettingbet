import React from "react"
import { Card } from "react-bootstrap"
import "./styles/profile.css"

const UserCard = (props) => {
  return (
    <Card>
      <div className="d-flex justify-content-center py-4">
        <img
          src={props.user.avatar}
          alt=""
          className="profile-img rounded-circle"
        />
      </div>
      <div className="d-flex justify-content-center mb-3">
        {props.user.name} {props.user.surname}
      </div>
      <Card.Body>
        <div>
          {props.user.course && props.user.course.course} student <br />
          {props.user.uni && props.user.uni.name},{" "}
          {props.user.uni && props.user.uni.location}
          <br />
          <br />
          <span className="medbig-txt grey thicker font-italic">
            Tutor fee: € {props.user.hourlyFee} / h
          </span>
        </div>
      </Card.Body>
    </Card>
  )
}

export default UserCard
