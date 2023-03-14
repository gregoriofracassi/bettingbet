import React from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import './dropdown.css'
import theme from '../../theme/theme'

const Dropdown = (props) => {
	return (
		<ThemeProvider theme={theme}>
			<Autocomplete
				id="combo-box-demo"
				options={['ciao', 'ciao', 'ciao', 'ciao', 'ciao']}
				renderInput={(params) => <TextField {...params} label="Sport" size="small" />}
			/>
		</ThemeProvider>
	)
}

export default Dropdown
