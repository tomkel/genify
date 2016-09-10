import React from 'react'

const querystring = require('querystring')

class Layout extends React.Component {

  state = { playlists: null }

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
      <div>
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
