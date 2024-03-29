import React from 'react'
import PropTypes from 'prop-types'
import { Outlet } from 'react-router-dom'
import Button from '@mui/material/Button'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import red from '@mui/material/colors/red'
import type { Theme } from '@mui/material/styles'
import type Styles from './Styles.d.ts'

function getStyles(muiTheme: Theme): Styles {
  return {
    container: {
      fontFamily: 'Roboto, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: '97vh',
      height: '100vh',
      paddingTop: '1vh',
      paddingRight: '10px',
      paddingLeft: '10px',
      paddingBottom: '1.5vh',
      backgroundColor: muiTheme.palette.background.default,
      color: muiTheme.palette.text.primary,
    },
    main: {
      flex: 1,
    },
    mainChildren: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
    },
    headerButton: {
      letterSpacing: '0.5em',
      color: '#fff',
      fontWeight: '700',
    },
    footer: {
      marginTop: '1.5rem',
      fontWeight: '500',
    },
    heart: {
      width: '0.65em',
      height: '0.65em',
    },
    github: {
      fill: muiTheme.palette.text.primary,
      width: '1.5rem',
      height: '1.5rem',
    },
    nameLink: {
      textDecoration: 'none',
      color: muiTheme.palette.secondary.main,
    },
  }
}

const HeartIcon = (props: SvgIconProps) => (
  <SvgIcon sx={{ color: red[600], '&:hover': { color: red.A100 } }} viewBox="0 0 32 29.6" {...props}>
    <path
      d={`M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
      c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z`}
    />
  </SvgIcon>
)

const OctocatIcon = (props: React.SVGProps<SVGSVGElement>) =>
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" /></svg>


export type LayoutContext = [
  style: Styles,
]
Layout.propTypes = {
  theme: PropTypes.object.isRequired,
}
export default function Layout(props: { theme: Theme }) {
  const styles = getStyles(props.theme)

  const context: LayoutContext = [styles]

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <a href="/genify/">
          <Button sx={styles.headerButton}>Genify</Button>
        </a>
        <a href="https://github.com/tomkel/genify" target="_blank" rel="noreferrer noopener">
          <OctocatIcon style={styles.github} />
        </a>
      </header>
      <main style={styles.main}>
        <Outlet context={context}></Outlet>
      </main>
      <footer style={styles.footer}>
        Made with <HeartIcon key="heart" style={styles.heart} /> by
        <a href="/" style={styles.nameLink}> Tommy Kelly</a>
      </footer>
    </div>
  )
}
