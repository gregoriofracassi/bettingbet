import React from "react"
import { Card } from "react-bootstrap"
import "./styles/profile.css"

const Tester = (props) => {
  return (
    <Card>
      <div className="d-flex justify-content-center py-4">
        <img
          src='https://thumbs.dreamstime.com/b/green-hills-landscape-tuscany-italy-under-blue-sky-cypress-trees-countryside-spring-summer-nature-background-149591026.jpg'
          alt=""
          className="profile-img rounded-circle"
        />
      </div>
      <div className="d-flex justify-content-center mb-3">
        Carlo Piazzacazzo
      </div>
      <Card.Body>
        <div>
          Czzoaaa <br />
          Scopacazoinculoa
          <br />
          <br />
          <span className="medbig-txt grey thicker font-italic">
            Tutor fee: € 45 / h
          </span>
        </div>
      </Card.Body>
    </Card>
  )
}

export default Tester
