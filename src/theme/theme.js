import { createTheme } from '@mui/material/styles'

const themeOptions = {
	palette: {
		mode: 'light',
		primary: {
			main: '#2f52e0',
			light: '#4064f1',
			dark: '#072bbb',
		},
		secondary: {
			main: '#23ce6b',
		},
		text: {
			secondary: 'rgb(155, 155, 155)',
			primary: 'rgb(63, 63, 63)',
		},
		background: {
			paper: '#f7f9fa',
		},
		divider: '#3F3F3F',
	},
	typography: {
		fontFamily: 'Poppins',
        fontSize: 12,
	},
	components: {
		MuiOutlinedInput: {
			styleOverrides: {
				root: {
                    backgroundColor: 'white',
					'& .MuiOutlinedInput-notchedOutline': {
                        borderRadius: 5,
						border: '1px solid #e2e2e2',
					},
				},
			},
		},
	},
}

const theme = createTheme(themeOptions)

export default theme
