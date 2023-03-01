import React, { useEffect, useState, useRef } from "react"
import { FullScreen, useFullScreenHandle } from "react-full-screen"
import { useCookies } from "react-cookie"
import { useSelector } from "react-redux"
import RatingModal from "./RatingModal"
import io from "socket.io-client"
import Peer from "simple-peer"
import { Container, Navbar, Modal, Button } from "react-bootstrap"
import "./styles/mySessions.css"
import {
  Mic,
  CameraVideo,
  Telephone,
  FileArrowUp,
  ChatLeftDots,
  Fullscreen,
} from "react-bootstrap-icons"

const MySessions = (props) => {
  const [rateModal, setRateModal] = useState(false)
  const [ratingComplete, setRatingComplete] = useState(false)
  const [role, setRole] = useState("")
  const [show, setShow] = useState(true)
  const [isPartnerHere, setIsPartnerHere] = useState(false)
  const [cookies] = useCookies(["token"])
  const [sessionId] = useState(props.match.params.id)
  const [tutorSession, setTutorSession] = useState({
    course: "",
    tutor: "",
    student: "",
    subject: "",
  })
  const [yourID, setYourID] = useState("")
  const [users, setUsers] = useState({})
  const [stream, setStream] = useState()
  const [receivingCall, setReceivingCall] = useState(false)
  const [caller, setCaller] = useState("")
  const [callerSignal, setCallerSignal] = useState()
  const [calling, setCalling] = useState(false)
  const [callAccepted, setCallAccepted] = useState(false)
  const [callEnded, setCallEnded] = useState(false)

  const userVideo = useRef()
  const partnerVideo = useRef()
  const socket = useRef()
  const peerRef = useRef()
  const loggedUser = useSelector((state) => state.loggedUser)
  const handle = useFullScreenHandle()

  useEffect(() => {
    const getSession = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_URL}/tutorSessions/specific/${sessionId}`,
          {
            headers: {
              Authorization: `Bearer ${cookies.token}`,
            },
          }
        )
        if (response.ok) {
          const currentSession = await response.json()
          setTutorSession(currentSession)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getSession()

    socket.current = io.connect(process.env.REACT_APP_URL)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream)
        if (userVideo.current) {
          userVideo.current.srcObject = stream
        }
      })

    socket.current.on("yourID", (id) => {
      setYourID(id)
      socket.current.emit("setMyId", {
        userId: loggedUser._id,
      })
    })
    socket.current.on("allUsers", (users) => {
      setUsers(users)
    })

    socket.current.on("hey", (data) => {
      setReceivingCall(true)
      setCaller(data.from)
      setCallerSignal(data.signal)
    })

    socket.current.on("callOver", () => {
      console.log("received call over")
      setCallEnded(true)
      peerRef.current?.destroy()
    })

    socket.current.on("user left", (users) => {
      setReceivingCall(false)
      setCaller("")
      setCallAccepted(false)
      setUsers(users)
      peerRef.current?.destroy()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (tutorSession.student._id === loggedUser._id) setRole("student")
    if (tutorSession.tutor._id === loggedUser._id) setRole("tutor")
  }, [tutorSession, loggedUser])

  useEffect(() => {
    if (role === "student") {
      setRateModal(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callEnded])

  useEffect(() => {
    let partnerId = ""
    if (role === "student") {
      partnerId = tutorSession.tutor._id
    } else if (role === "tutor") {
      partnerId = tutorSession.student._id
    }
    if (users[partnerId]) setIsPartnerHere(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users])

  const callPeer = (id) => {
    setCalling(true)
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    })

    peer.on("signal", (data) => {
      socket.current.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: yourID,
      })
    })

    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream
      }
    })

    socket.current.on("callAccepted", (signal) => {
      setCallAccepted(true)
      handleClose()
      peerRef.current = peer
      peer.signal(signal)
    })
  }

  const acceptCall = () => {
    setCallAccepted(true)
    handleClose()
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    })
    peer.on("signal", (data) => {
      socket.current.emit("acceptCall", { signal: data, to: caller })
    })

    peer.on("stream", (stream) => {
      partnerVideo.current.srcObject = stream
    })
    peerRef.current = peer

    peer.signal(callerSignal)
  }

  const endCall = () => {
    setReceivingCall(false)
    setCaller("")
    setCallAccepted(false)
    setCallEnded(true)
    if (role === "student") setRateModal(true)
    socket.current.emit("callEnded", {
      user:
        role === "tutor" ? tutorSession.student._id : tutorSession.tutor._id,
    })
  }

  const handleClose = () => setShow(false)

  const closeRateModal = () => {
    setRateModal(false)
    if (ratingComplete) {
      setRatingComplete(false)
    }
  }

  return (
    <>
      <RatingModal
        modalType="tutor"
        toRate={tutorSession}
        ratingComplete={ratingComplete}
        show={rateModal}
        closeRateModal={closeRateModal}
      />
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Body className="py-4">
          {callEnded ? (
            "call is over"
          ) : receivingCall || calling ? (
            role === "tutor" ? (
              `${tutorSession.student.name} is calling you...`
            ) : (
              `Waiting for ${tutorSession.tutor.name} to answer...`
            )
          ) : isPartnerHere ? (
            <>
              {role === "tutor"
                ? `${tutorSession.student.name} is here! will call you asap!`
                : `${tutorSession.tutor.name} is here, you can start the call!`}
            </>
          ) : (
            <>
              {`Your ${tutorSession.subject.subject} lesson will start
              shortly,`}
              <br />
              {role === "tutor"
                ? tutorSession.student.name
                : tutorSession.tutor.name}{" "}
              is not here yet...
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {role === "student" ? (
            <Button
              variant="success"
              size="sm"
              onClick={() => callPeer(users[tutorSession.tutor._id])}
            >
              Call
            </Button>
          ) : (
            <Button variant="success" size="sm" onClick={acceptCall}>
              Answer
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <Container>
        <FullScreen handle={handle}>
          <div className="video-container d-flex justify-content-center">
            {callAccepted && (
              <video
                playsInline
                ref={partnerVideo}
                autoPlay
                className="video"
              />
            )}
            <div className="userVideo">
              {stream && (
                <video
                  playsInline
                  muted
                  ref={userVideo}
                  className="video"
                  autoPlay
                />
              )}
            </div>
            <Navbar className="video-menu justify-content-between align-items-end pb-3">
              <div>
                <Mic className="mx-2 my-1" />
                <CameraVideo className="mx-2 my-1" />
              </div>
              <div>
                <FileArrowUp className="mx-2 my-1" />
                <Telephone
                  className="mx-3 my-1 phone-icon pointer"
                  onClick={endCall}
                />
                <ChatLeftDots className="mx-2 my-1" />
              </div>
              <div className="pointer" onClick={handle.enter}>
                <Fullscreen className="mx-2 my-1" />
              </div>
            </Navbar>
          </div>
        </FullScreen>
      </Container>
    </>
  )
}

export default MySessions
