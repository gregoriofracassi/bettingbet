import React, { useEffect, useState } from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import { FolderCheck, InfoCircle, Filter, GraphUp, Bell, Heart } from 'react-bootstrap-icons'
import './arbitrage.css'

const Arbitrage = (props) => {
	const [pageContent, setPageContent] = useState('opportunities')

	return (
		<div className="main-container">
			<Row>
                {/* ----------- SIDEBAR ---------- */}
				<Col md={2}>
					<div className="sidebar dark-green-bg">
						<div className="py-1 px-2 mb-4 mt-2">Surebets</div>
						<div className="font-sm">
							<div className={`round-rectangle pointer py-2 px-3 ${pageContent === 'opportunities' && 'selected'}`} onClick={() => setPageContent('opportunities')}>
								<span className="mr-2 icon-font">
									<FolderCheck />
								</span>
								Opportunities
							</div>
							<div className={`round-rectangle pointer py-2 px-3 ${pageContent === 'guides' && 'selected'}`} onClick={() => setPageContent('guides')}>
								<span className="mr-2 icon-font">
									<InfoCircle />
								</span>
								Guides
							</div>
							<div className={`round-rectangle pointer py-2 px-3 ${pageContent === 'favourites' && 'selected'}`} onClick={() => setPageContent('favourites')}>
								<span className="mr-2 icon-font">
									<Heart />
								</span>
								Favourites
							</div>
							<div className={`round-rectangle pointer py-2 px-3 ${pageContent === 'analytics' && 'selected'}`} onClick={() => setPageContent('analytics')}>
								<span className="mr-2 icon-font">
									<GraphUp />
								</span>
								Analytics
							</div>
							<div className={`round-rectangle pointer py-2 px-3 ${pageContent === 'notifications' && 'selected'}`} onClick={() => setPageContent('notifications')}>
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
				<Col md={10}></Col>
                {/* -------------- GRID END --------------- */}
			</Row>
		</div>
	)
}

export default Arbitrage
