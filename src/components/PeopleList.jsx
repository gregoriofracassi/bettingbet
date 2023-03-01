import React, { useState, useEffect } from "react"
import { Card, ListGroup } from "react-bootstrap"
import { useCookies } from "react-cookie"
import { withRouter } from "react-router-dom"
import "./styles/poepleList.css"

const PeopleList = (props) => {
  const [people, setPeople] = useState([
    { _id: "", avatar: "", name: "", surname: "", course: { course: "" } },
  ])
  const [cookies] = useCookies(["token"])

  useEffect(() => {
    const getSearchResult = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL}/search?key=`,
          {
            headers: {
              Authorization: `Bearer ${cookies.token}`,
            },
          }
        )
        if (response.ok) {
          const result = await response.json()
          setPeople(result.uni.users)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getSearchResult()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const userChange = (id) => {
    props.history.push(`/profile/${id}`)
  }

  return (
    <Card>
      <Card.Header className="grey-bg">People you may know</Card.Header>
      <Card.Body className="px-3 py-0">
        <ListGroup variant="flush">
          {people.map((user) => {
            return (
              <ListGroup.Item className="px-1 pointer" key={user._id}>
                <div className="d-flex" onClick={() => userChange(user._id)}>
                  <div className="align-self-center mr-3">
                    <img
                      className="avatar-sm rounded-circle"
                      src={user.avatar}
                      alt=""
                    />
                  </div>
                  <div className="align-self-center">
                    <div className="medbig-txt thicker green">
                      {user.name} {user.surname}
                    </div>
                    <div className="medsm-txt">
                      {user.course.course} student
                    </div>
                  </div>
                </div>
              </ListGroup.Item>
            )
          })}
        </ListGroup>
      </Card.Body>
      <Card.Footer className="green thicker pointer grey-bg">
        See more...
      </Card.Footer>
    </Card>
  )
}

export default withRouter(PeopleList)
