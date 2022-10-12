import React from 'react'
import PropTypes from 'prop-types'
// import { withPrefix, Link } from 'gatsby'

// window && typeof window !== 'undefined' && window.test = 'testing'
import Logo from './images/purelypeer-splash.png'
export default function HTML (props) {
  return (
    <html {...props.htmlAttributes}>
      <head>
        <meta charSet='utf-8' />
        <meta httpEquiv='x-ua-compatible' content='ie=edge' />
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, shrink-to-fit=no'
        />

        {/* leafletjs css */}
        <link
          rel='stylesheet' href='https://unpkg.com/leaflet@1.7.1/dist/leaflet.css'
          integrity='sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=='
          crossorigin=''
        />

        {/* leafletjs js */}
        <script
          src='https://unpkg.com/leaflet@1.7.1/dist/leaflet.js'
          integrity='sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=='
          crossorigin=''
        />

        {/* minimal-slp-wallet-web */}
        <script src='https://unpkg.com/minimal-slp-wallet@v4.20.9' />

        {/* bch-message-lib */}
        <script src='https://unpkg.com/bch-message-lib@2.1.4' />

        {props.headComponents}
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <div
          key='splash'
          id='___splash'
          style={{
            alignItems: 'center',
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'center',
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            zIndex: 9000
          }}
        >
          <img src={Logo} style={{ width: '500px' }} />
        </div>
        <div
          key='body'
          id='___gatsby'
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}
      </body>
    </html>
  )
}

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array
}
