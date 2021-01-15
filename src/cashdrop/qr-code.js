import React from 'react'
import { Row, Col, Button } from 'adminlte-2-react'
import PropTypes from 'prop-types'

const QRCode = require('qrcode.react')

let _this
class CashDropQr extends React.Component {
  constructor (props) {
    super(props)
    _this = this
  }

  render () {
    return (
      <Row>
        <Col xs={12}>
          <QRCode
            id='CashDropQr'
            className='qr-code'
            value={_this.props.address}
            size={256}
            includeMargin
            fgColor='#333'
          />
          <p className='cashdrop-amount'>Amount : <b>{_this.props.amount}</b></p>

        </Col>
        <Col sm={12} className='text-center mb-2'>
          <Button
            text='Close'
            type=''
            className='btn-lg'
            onClick={_this.props.handleOnHide}
          />
        </Col>
      </Row>
    )
  }

  async componentDidMount () {
    // _this.handleScroll()
  }

  // Scrolls the view to the QR code
  handleScroll () {
    const card = document.getElementById('CashDropQr')
    card.scrollIntoView({ behavior: 'smooth' })
  }
}
CashDropQr.propTypes = {
  handleOnHide: PropTypes.func.isRequired, // Function to close
  amount: PropTypes.string.isRequired, // Quantity of sats to show
  address: PropTypes.string.isRequired
}
export default CashDropQr
