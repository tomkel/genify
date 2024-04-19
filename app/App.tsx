import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { grey } from '@mui/material/colors'
import CssBaseline from '@mui/material/CssBaseline'
import { PaletteOptions, ThemeProvider, createTheme } from '@mui/material/styles'
import AuthButton from './components/AuthButton.tsx'
import End from './components/End.tsx'
import Generate from './components/Generate.tsx'
import Layout from './components/Layout.tsx'
import Save from './components/Save/Save.tsx'
import log from './log.ts'
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

const router = createBrowserRouter([
  {
    path: import.meta.env.BASE_URL,
    element: <Layout />,
    children: [
      { index: true, element: <AuthButton /> },
      { path: 'generate', element: <Generate /> },
      { path: 'save', element: <Save /> },
      { path: 'end', element: <End /> },
    ],
  },
])

export default function App() {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  )
}
