import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import './dropdown.css'

const Dropdown = (props) => {
	const useStyles = makeStyles({
		container: {
			backgroundColor: '#f8f8ff',
			borderRadius: 10,
			padding: 16,
		},
		select: {
			borderRadius: 8,
			backgroundColor: 'white',
			'& .MuiSelect-icon': {
				color: '#000',
			},
			'&:focus': {
				backgroundColor: '#FFFFFF',
				borderRadius: 10,
				boxShadow: '0 0 0 2px #bfbfbf',
                '& .MuiSelect-select': {
                    backgroundColor: '#000000',
                },
			},
			'&:before': {
				content: '""',
				display: 'none',
			},
			'&:after': {
				content: '""',
				display: 'none',
			},
			'& .MuiSelect-root': {
				borderRadius: 8,
				paddingRight: 32,
				border: '1px solid #e2e2e2',
			},
		},
		menuPaper: {
			borderRadius: 10,
		},
	})

	const classes = useStyles()

	return (
		<Box className={classes.container}>
			<Select
				className={classes.select}
				MenuProps={{
					classes: { paper: classes.menuPaper },
					anchorOrigin: {
						vertical: 'bottom',
						horizontal: 'left',
					},
					transformOrigin: {
						vertical: 'top',
						horizontal: 'left',
					},
					getContentAnchorEl: null,
				}}
				displayEmpty
			>
				<MenuItem value="">Select an option</MenuItem>
				<MenuItem value="option1">Option 1</MenuItem>
				<MenuItem value="option2">Option 2</MenuItem>
				<MenuItem value="option3">Option 3</MenuItem>
			</Select>
		</Box>
	)
}

export default Dropdown