import React, { useEffect, useRef, useState } from 'react'
import { Row, Col, ListGroup, Badge, Card } from 'react-bootstrap'
import { FolderCheck, InfoCircle, Filter, GraphUp, Bell, Heart, ArrowUpShort, ArrowDownShort, ArrowLeftShort, ArrowRightShort } from 'react-bootstrap-icons'
import './arbitrage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBasketballBall } from '@fortawesome/free-solid-svg-icons'
import { getFootballArbs } from '../../services/arbs/football'
import Dropdown from '../dropdown/Dropdown'

const Arbitrage = (props) => {
	const [pageContent, setPageContent] = useState('opportunities')
	const [arbs, setArbs] = useState([])
	const [arbsLoading, setArbsLoading] = useState(false)
	const [navLinks, setNavLinks] = useState(null)
	const listRef = useRef(null)
	const [sportFilter, setSportFilter] = useState('')
	const [query, setQuery] = useState({
		sort: {
			value: {
				date: false,
				sport: false,
				win_percentage: false,
				sortBy: 'win_percentage',
			},
			active: true,
		},
		limit: 12,
	})

	const changeSortQuery = (criteria) => {
		const newQuery = { ...query }
		newQuery.sort.value.sortBy = criteria
		newQuery.sort.value[criteria] = !newQuery.sort.value[criteria]
		setQuery(newQuery)
		getArbs()
		scrollToList()
	}

	const scrollToList = () => window.scroll({ top: 115, left: 0, behavior: 'smooth' })

	const getArbs = async (page) => {
		try {
			setArbsLoading(true)
			const link = page ? navLinks[page] : null
			const response = await getFootballArbs(query, link)
			if (response.ok) {
				const result = await response.json()
				setArbs(result.arbs)

				const links = {}
				for (const [key, val] of Object.entries(result.links)) {
					links[key] = val
				}
				setNavLinks(links)
				setArbsLoading(false)
				if (page) scrollToList()
			} else {
				console.log('response inst ok')
			}
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		getArbs()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className="main-container">
			<Row>
				{/* ----------- SIDEBAR ---------- */}
				<Col md={3}>
					<div className="sidebar mid-blue-bg">
						<div className="py-1 px-2 mb-4 mt-2">Surebets</div>
						<div className="sections">
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

				<Col md={9} className="pl-0">
					{arbsLoading ? (
						<h1>Loading...</h1>
					) : (
						<>
							{/* ---------------- FILTERS ----------------  */}
							<Card className="filters">
								<Card.Body className="dark-white-bg">
									<Dropdown />
								</Card.Body>
							</Card>
							{/* ---------------- FILTERS END---------------- */}

							{/* ---------------- GRID ---------------- */}
							<ListGroup className="custom-list">
								<ListGroup.Item className="dark-white-bg" ref={listRef}>
									<Row className="text-nowrap list-header">
										<Col md={5}>
											<Row>
												<Col md={4} className="pointer" onClick={() => changeSortQuery('date')}>
													date{' '}
													{query.sort.value.date ? <ArrowUpShort className="icon-font" /> : <ArrowDownShort className="icon-font" />}
												</Col>
												<Col md={8}>event</Col>
											</Row>
										</Col>
										<Col md={7}>
											<Row>
												<Col md={1} className="pl-0 pointer" onClick={() => changeSortQuery('sport')}>
													sport{' '}
													{query.sort.value.sport ? <ArrowUpShort className="icon-font" /> : <ArrowDownShort className="icon-font" />}
												</Col>
												<Col md={3} className="pl-4">
													type
												</Col>
												<Col md={2} className="pointer" onClick={() => changeSortQuery('win_percentage')}>
													profit{' '}
													{query.sort.value.win_percentage ? (
														<ArrowUpShort className="icon-font" />
													) : (
														<ArrowDownShort className="icon-font" />
													)}
												</Col>
												<Col md={5}>bookies</Col>
												<Col md={1}></Col>
											</Row>
										</Col>
									</Row>
								</ListGroup.Item>
								{/* ------------------ ITERABLE LIST ELEMENT ----------------- */}
								{arbs.map((arb) => (
									<ListGroup.Item key={arb._id}>
										<Row className="list-elem">
											<Col md={5}>
												<Row>
													<Col md={4} className="d-flex align-items-center grid-cell date-time">
														09:13 - Jan 6, 2022
													</Col>
													<Col md={8} className="d-flex align-items-center grid-cell">
														{arb.game_id.teams[0].team_1}
														<span className="event-span">&nbsp; vs &nbsp;</span>
														{arb.game_id.teams[0].team_2}
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
														<Badge className="percentage p-2 green">{arb.win_percentage.toFixed(2) + '%'}</Badge>
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
								))}
								{/* ------------------ ITERABLE LIST ELEMENT END ----------------- */}
							</ListGroup>
							{/* -------------- GRID END --------------- // */}

							{/* -------------- PAGE NAVIGATION --------------- */}
							<hr className="py5" />
							<div className="d-flex list-header justify-content-between align-items-center page-nav">
								<div className="pointer d-flex align-items-center" onClick={() => getArbs('previous')}>
									<ArrowLeftShort className="icon-font" /> <div className="pl-1">Previous</div>
								</div>
								<div>
									<span className="pr-3 pointer" onClick={() => getArbs('first')}>
										First
									</span>{' '}
									...{' '}
									<span className="pl-3 pointer" onClick={() => getArbs('last')}>
										Last
									</span>
								</div>
								<div className="pointer d-flex align-items-center" onClick={() => getArbs('next')}>
									<div className="pr-1">Next</div> <ArrowRightShort className="icon-font" />
								</div>
							</div>
							{/* -------------- PAGE NAVIGATION END --------------- */}
						</>
					)}
				</Col>
			</Row>
		</div>
	)
}

export default Arbitrage
