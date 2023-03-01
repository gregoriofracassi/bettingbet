import React from "react"
import { Col, Container, Row } from "react-bootstrap"
import { Twitter, Instagram, Facebook } from "react-bootstrap-icons"
import "./styles/footer.css"

const Footer = () => {
  return (
    <div className="footer-container mt-5 py-5">
      <Container>
        <Row>
          <Col md={3}>
            <img
              src="https://res.cloudinary.com/difofe2r8/image/upload/v1634405589/UniHub/logocomplet_ianaat.png"
              alt=""
              className="logo-footer my-3"
            />
            <h5 className="my-2">Language: English (United States)</h5>
            <h5 className="my-3">Currency: EUR</h5>
          </Col>
          <Col md={3}>
            <div className="my-3">About</div>
            <div className="my-3">Careers</div>
            <div className="my-3">Brand</div>
            <div className="my-3">Press</div>
            <div className="my-3">Partners</div>
            <div className="my-3">Sitemap</div>
          </Col>
          <Col md={3}>
            <div className="my-3">Help Center &amp; FAQs</div>
            <div className="my-3">Developers</div>
            <div className="my-3">App Directory</div>
            <div className="my-3">Blog</div>
            <div className="my-3">Community Guidelines</div>
            <div className="my-3">Terms of Use</div>
            <div className="my-3">Privacy Policy</div>
            <div className="my-3">Privacy Preferences</div>
          </Col>
          <Col md={3}>
            <div className="my-3 d-flex">
              <div>
                <Twitter size="1.8em" className="mr-2" />
              </div>
              <div>
                <Instagram size="1.8em" className="mx-2" />
              </div>
              <div>
                <Facebook size="1.8em" className="ml-2" />
              </div>
            </div>
            <div className="my-4">© UniHub</div>
            <div className="my-3 font-italic">
              600 Townsend Street, Suite 500 San Francisco, CA 94103 USA Phone:
              +1 (833) 972-8766
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Footer
