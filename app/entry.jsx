import React from 'react';
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import grey from '@mui/material/colors/grey';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AuthButton from './components/AuthButton';
import End from './components/End';
import Generate from './components/Generate';
import Layout from './components/Layout';
import Save from './components/Save';
import log from './log';
//import '@fontsource/roboto/300.css';
//import '@fontsource/roboto/400.css';
//import '@fontsource/roboto/500.css';
//import '@fontsource/roboto/700.css';

window.addEventListener('unhandledrejection', (ev) => {
  log.error('Unhandled Rejection at: Promise ', ev, ' reason: ', ev.reason)
})

const palette = {
  primary1Color: '#3f3f42',
  accent1Color: '#84bd00',
  textColor: '#dfe0e6',
  secondaryTextColor: '#838486',
  // shows up on buttons
  alternateTextColor: '#dfe0e6',
  // used in Save.jsx
  cardBackground: '#222326',
  type: 'dark',
}

const theme = createTheme({
  // black background: #121314
  // lighter black background: #222326
  // muted gray <p> text: #838486
  // bright gray <h> text: #dfe0e6
  // accent green: #84bd00
  // icon white: #ffffff
  overlay: {
    backgroundColor: grey['900'],
  },
  palette,
  checkbox: {
    checkedColor: palette.secondaryTextColor,
    // equal to textColor/alternateTextColor by default
    boxColor: palette.secondaryTextColor,
  },
  backgroundColor: '#121314',
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
const root = createRoot(domNode);
root.render(<Main />);
