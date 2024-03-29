import React from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { grey } from '@mui/material/colors'
import CssBaseline from '@mui/material/CssBaseline'
import { PaletteOptions, ThemeProvider, createTheme } from '@mui/material/styles'
import AuthButton from './components/AuthButton'
import End from './components/End'
import Generate from './components/Generate'
import Layout from './components/Layout'
import Save from './components/Save/index'
import log from './log'
// import '@fontsource/roboto/300.css'
// import '@fontsource/roboto/400.css'
// import '@fontsource/roboto/500.css'
// import '@fontsource/roboto/700.css'

window.addEventListener('unhandledrejection', (ev) => {
  log.error('Unhandled Rejection at: Promise ', ev, ' reason: ', ev.reason)
})

const palette = {
  primary: { main: '#3f3f42', contrastText: '#dfe0e6' },
  secondary: { main: '#84bd00' },
  text: { primary: '#dfe0e6', secondary: '#838486' }, // alternateTextColor shows up on buttons
  mode: 'dark',
  background: { default: '#121314', paper: '#222326' },
} satisfies PaletteOptions

// for ##rrggbbaa notation
const alphaToHex = (decimal: number): string => (
  Math.trunc(decimal * 255).toString(16).padStart(2, '0')
)

const theme = createTheme({
  // black background: #121314
  // lighter black background: #222326
  // muted gray <p> text: #838486
  // bright gray <h> text: #dfe0e6
  // accent green: #84bd00
  // icon white: #ffffff
  palette,
  components: {
    MuiBackdrop: {
      styleOverrides: { root: { backgroundColor: grey[900] } },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '&.Mui-checked': { color: palette.text.secondary },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: palette.primary.contrastText + alphaToHex(0.4) },
        }
      }
    }
  },
})

const basePath = process.env.NODE_ENV === 'development' ? '/' : '/genify'

const router = createBrowserRouter([
  {
    path: basePath,
    element: <Layout theme={theme} />,
    children: [
      { path: 'generate', element: <Generate /> },
      { path: 'save', element: <Save /> },
      { path: 'end', element: <End /> },
      { index: true, element: <AuthButton /> },
    ],
  },
])

class Main extends React.Component {
  render() {
    return (
      <React.StrictMode>
        <CssBaseline>
          <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
          </ThemeProvider>
        </CssBaseline>
      </React.StrictMode>
    )
  }
}

const domNode = document.getElementById('app')
if (!domNode) throw new Error('no root found')
const root = createRoot(domNode)
root.render(<Main />)
