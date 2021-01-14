/*
  This is a demonstration component. It helps to show how you can create new
  menu items and Views in your own BCH web wallet dashboard app.

  This file controls the View (the part on the right side of the dashboard) of
  the component. The menu item is controlled by the menu-components.js file.
*/

import React from 'react'
import { Plugins } from '@capacitor/core'
import { Row, Col, Content, Box, Button, Inputs } from 'adminlte-2-react'
import { Helmet } from 'react-helmet'
import CashDropForm from './form'
import CashDropMap from './map'
let _this
class CashDrop extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {

    }
  }

  render () {
    return (

      <Content
        browserTitle='CashDrop'
      >
        <Row>
          <Col xs={12}>
            <CashDropMap />
            <CashDropForm />
          </Col>
        </Row>
      </Content>
    )
  }

  async componentDidMount () {
  }
}

export default CashDrop
