import React from 'react';
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { grey } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import { PaletteOptions, ThemeProvider, createTheme } from '@mui/material/styles';
import AuthButton from './components/AuthButton';
import End from './components/End';
import Generate from './components/Generate';
import Layout from './components/Layout';
import Save from './components/Save/index';
import log from './log';
//import '@fontsource/roboto/300.css';
//import '@fontsource/roboto/400.css';
//import '@fontsource/roboto/500.css';
//import '@fontsource/roboto/700.css';

window.addEventListener('unhandledrejection', (ev) => {
  log.error('Unhandled Rejection at: Promise ', ev, ' reason: ', ev.reason)
})

const palette: PaletteOptions = {}
palette.primary = { main: '#3f3f42', contrastText: '#dfe0e6' }
palette.secondary = { main: '#84bd00' }
palette.text = { primary: '#dfe0e6', secondary: '#838486' }
// alternateTextColor shows up on buttons
// cardBackground used in Save.tsx
palette.mode = 'dark'
palette.background = { default: '#121314' }

const theme = createTheme({
  // black background: #121314
  // lighter black background: #222326
  // muted gray <p> text: #838486
  // bright gray <h> text: #dfe0e6
  // accent green: #84bd00
  // icon white: #ffffff
  components: {
    MuiBackdrop: {
      styleOverrides: { root: { backgroundColor: grey['900'] }},
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          backgroundColor: palette.secondary.main, // equal to textColor/alternateTextColor by default
          '&Mui.checked': { backgroundColor: palette.secondary.main, },
         },
      },
    },
  },
  palette,
})

const basePath = process.env.NODE_ENV === 'development' ? '/' : '/genify'

const router = createBrowserRouter([
  { 
    path: basePath, 
    element: <Layout theme={theme}/>,
    children: [
      { path: 'generate', element: <Generate /> },
      { path: 'save', element: <Save theme={theme}/> },
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

const domNode = document.getElementById('app');
if (!domNode) throw new Error('no root found')
const root = createRoot(domNode);
root.render(<Main />);
