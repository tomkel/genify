import React from 'react'

const querystring = require('querystring')

class Layout extends React.Component {
  // state: only use if it only affects this component and only this compnent
  // props: if it affects multiple components, use props.
  render() {
    // remove leading #
    const parsedObj = querystring.parse(this.props.location.hash.substr(1))
    const token = parsedObj.access_token || null
    const children = token ? React.cloneElement(this.props.children, { token }) : this.props.children
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
