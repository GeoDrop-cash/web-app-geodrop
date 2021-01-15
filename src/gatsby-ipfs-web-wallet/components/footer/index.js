/*
  This is an example of using Gatsby 'Component Shadowing' to overwrite the
  default Wallet View. It injects the same TX History component at the bottom
  of the Wallet View.
*/

import React from 'react'
import { Row, Col } from 'adminlte-2-react'
import 'gatsby-ipfs-web-wallet/src/components/footer/footer.css'
import './footer.css'
// import Footer from 'gatsby-ipfs-web-wallet/src/components/footer'
class Footer2 extends React.Component {
  // class Wallet2 extends React.Component {
  constructor (props) {
    super(props)
    console.log('Loading new example view.')

    // console.log('Wallet info: ', props.walletInfo)
  }

  render () {
    return (
      <>
        <section id='footer2'>
          <Row className='footer-container'>
            <Col md={12} className='footer-section'>
              <small><strong>Sponsored By:</strong> FullStack.cash</small>
            </Col>
          </Row>
        </section>
      </>
    )
  }

  async componentDidMount () {

  }
}

export default Footer2
