import React, { useEffect, useState } from 'react'
import { Row, Col, ListGroup, Badge } from 'react-bootstrap'
import { FolderCheck, InfoCircle, Filter, GraphUp, Bell, Heart, ArrowUp, ArrowDown } from 'react-bootstrap-icons'
import './arbitrage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBasketballBall } from '@fortawesome/free-solid-svg-icons'

const Arbitrage = (props) => {
	const [pageContent, setPageContent] = useState('opportunities')
	const [arbs, setArbs] = useState([])

	useEffect(() => {
		const getArbs = async () => {
			try {
				const response = await fetch(`${process.env.REACT_APP_URL}/arbs/football`, {
					// headers: {
					// 	Authorization: `Bearer ${cookies.token}`,
					// },
				})
				if (response.ok) {
					const result = await response.json()
					setArbs(result)
				}
			} catch (error) {
				console.log(error)
			}
		}
		getArbs()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className="main-container">
			<Row>
				{/* ----------- SIDEBAR ---------- */}
				<Col md={2}>
					<div className="sidebar mid-blue-bg">
						<div className="py-1 px-2 mb-4 mt-2">Surebets</div>
						<div className="font-sm">
							<div
								className={`round-rectangle pointer py-2 px-3 ${pageContent === 'opportunities' && 'selected'}`}
								onClick={() => setPageContent('opportunities')}
							>
								<span className="mr-2 icon-font">
									<FolderCheck />
								</span>
								Opportunities
							</div>
							<div
								className={`round-rectangle pointer py-2 px-3 ${pageContent === 'guides' && 'selected'}`}
								onClick={() => setPageContent('guides')}
							>
								<span className="mr-2 icon-font">
									<InfoCircle />
								</span>
								Guides
							</div>
							<div
								className={`round-rectangle pointer py-2 px-3 ${pageContent === 'favourites' && 'selected'}`}
								onClick={() => setPageContent('favourites')}
							>
								<span className="mr-2 icon-font">
									<Heart />
								</span>
								Favourites
							</div>
							<div
								className={`round-rectangle pointer py-2 px-3 ${pageContent === 'analytics' && 'selected'}`}
								onClick={() => setPageContent('analytics')}
							>
								<span className="mr-2 icon-font">
									<GraphUp />
								</span>
								Analytics
							</div>
							<div
								className={`round-rectangle pointer py-2 px-3 ${pageContent === 'notifications' && 'selected'}`}
								onClick={() => setPageContent('notifications')}
							>
								<span className="mr-2 icon-font">
									<Bell />
								</span>
								Notifications
							</div>
						</div>
					</div>
				</Col>
				{/* ------------- SIDEBAR END ------------- */}

				{/* ------------- GRID ------------- */}
				<Col md={10}>
					<ListGroup className="custom-list">
						<ListGroup.Item className="dark-white-bg">
							<Row className="text-nowrap list-header">
								<Col md={5}>
									<Row>
										<Col md={4}>
											date <ArrowDown />
										</Col>
										<Col md={8}>event</Col>
									</Row>
								</Col>
								<Col md={7}>
									<Row>
										<Col md={1} className="pl-0">
											sport
											<ArrowDown />
										</Col>
										<Col md={3} className="pl-4">
											type
										</Col>
										<Col md={2}>
											profit <ArrowDown />
										</Col>
										<Col md={5}>bookies</Col>
										<Col md={1}></Col>
									</Row>
								</Col>
							</Row>
						</ListGroup.Item>

						{/* ------------------ ITERABLE LIST ELEMENT ----------------- */}
						<ListGroup.Item>
							<Row className="list-elem">
								<Col md={5}>
									<Row>
										<Col md={4} className="d-flex align-items-center grid-cell date-time">
											09:13 - Jan 6, 2022
										</Col>
										<Col md={8} className="d-flex align-items-center grid-cell">
											F.C. Barcelona<span className="event-span">&nbsp; vs &nbsp;</span>Real Madrid
										</Col>
									</Row>
								</Col>
								<Col md={7}>
									<Row>
										<Col md={1} className="d-flex align-items-center grid-cell pl-0">
											<FontAwesomeIcon icon={faBasketballBall} className="sport" />
										</Col>
										<Col md={3} className="d-flex align-items-center grid-cell pl-4">
											Double Chance
										</Col>
										<Col md={2} className="d-flex align-items-center grid-cell">
											<Badge className="percentage p-2 green">7.23%</Badge>
										</Col>
										<Col md={5} className="d-flex align-items-center grid-cell">
											WilliamHill / Better / GiocoDIgitale
										</Col>
										<Col md={1} className="d-flex align-items-center grid-cell">
											<Heart />
										</Col>
									</Row>
								</Col>
							</Row>
						</ListGroup.Item>
						{/* ------------------ END OF ITERABLE LIST ELEMENT ----------------- */}
						
					</ListGroup>
				</Col>
				{/* -------------- GRID END --------------- */}
			</Row>
		</div>
	)
}

export default Arbitrage
