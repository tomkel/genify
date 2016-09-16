import React from 'react'

const querystring = require('querystring')

const styles = {
  container: {
    fontFamily: 'Roboto, sans-serif',
  },
}

class Layout extends React.Component {

  state = { playlists: undefined }

  setPlaylists = (playlists) => {
    this.setState({ playlists })
  }

  render() {
    // remove leading #
    const parsedObj = querystring.parse(this.props.location.hash.substr(1))
    const token = parsedObj.access_token || null
    const children = React.cloneElement(this.props.children,
        { token, setPlaylists: this.setPlaylists, playlists: this.state.playlists })
    return (
      <div style={styles.container}>
        <header>header</header>
        <main>
          {children}
        </main>
        <footer>footer</footer>
      </div>
    )
  }
}

export default Layout
