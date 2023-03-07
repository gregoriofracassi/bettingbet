import React, { useEffect, useState } from 'react'
import { Row, Col, ListGroup } from 'react-bootstrap'
import { FolderCheck, InfoCircle, Filter, GraphUp, Bell, Heart } from 'react-bootstrap-icons'
import './arbitrage.css'

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
					<div className="sidebar dark-green-bg">
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
					<ListGroup>
						<ListGroup.Item className='dark-white-bg'>Cras justo odio</ListGroup.Item>
						<ListGroup.Item>DapGGac facilisis in</ListGroup.Item>
						<ListGroup.Item>Morbi leo risus</ListGroup.Item>
						<ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
						<ListGroup.Item>Vestibulum at eros</ListGroup.Item>
						<ListGroup.Item className='dark-white-bg'>Cras justo odio</ListGroup.Item>
						<ListGroup.Item>DapGGac facilisis in</ListGroup.Item>
						<ListGroup.Item>Morbi leo risus</ListGroup.Item>
						<ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
						<ListGroup.Item>Vestibulum at eros</ListGroup.Item>
						<ListGroup.Item className='dark-white-bg'>Cras justo odio</ListGroup.Item>
						<ListGroup.Item>DapGGac facilisis in</ListGroup.Item>
						<ListGroup.Item>Morbi leo risus</ListGroup.Item>
						<ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
						<ListGroup.Item>Vestibulum at eros</ListGroup.Item>
						<ListGroup.Item className='dark-white-bg'>Cras justo odio</ListGroup.Item>
						<ListGroup.Item>DapGGac facilisis in</ListGroup.Item>
						<ListGroup.Item>Morbi leo risus</ListGroup.Item>
						<ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
						<ListGroup.Item>Vestibulum at eros</ListGroup.Item>
						<ListGroup.Item className='dark-white-bg'>Cras justo odio</ListGroup.Item>
						<ListGroup.Item>DapGGac facilisis in</ListGroup.Item>
						<ListGroup.Item>Morbi leo risus</ListGroup.Item>
						<ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
						<ListGroup.Item>Vestibulum at eros</ListGroup.Item>
					</ListGroup>
				</Col>
				{/* -------------- GRID END --------------- */}
			</Row>
		</div>
	)
}

export default Arbitrage
