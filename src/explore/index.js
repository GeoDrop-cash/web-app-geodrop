/*
  This is a demonstration component. It helps to show how you can create new
  menu items and Views in your own BCH web wallet dashboard app.

  This file controls the View (the part on the right side of the dashboard) of
  the component. The menu item is controlled by the menu-components.js file.
*/

import React from 'react'
import { Content } from 'adminlte-2-react'
import NavMenu from '../nav-menu'

const BchWallet =
  typeof window !== 'undefined'
    ? window.SlpWallet
    : null

let _this
class Explore extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {

    }
  }

  render () {
    return (
      <>
        <NavMenu />
        <Content
          title='Explore'
          subTitle='Explore'
          browserTitle='Explore'
        >

        </Content>
      </>
    )
  }

  componentDidMount () {
  }
}

export default Explore
