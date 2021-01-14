/*
  This is an example of using Gatsby 'Component Shadowing' to overwrite the
  default Wallet View. It injects the same TX History component at the bottom
  of the Wallet View.
*/

import React from 'react'
import { Row, Col, Content, Box, Button } from 'adminlte-2-react'
import './nav-menu.css'

let _this
class NavMenu extends React.Component {
  // class Wallet2 extends React.Component {
  constructor (props) {
    super(props)
    console.log('Loading nav menu.')
    _this = this
  }

  render () {
    return (
      <section style={{ display: 'none' }}>
        <div id='nav-btn-menu' >
          <Row>
            <Col xs={12} >
              <Button
                type='primary'
                text='Cash Drop'
                className="nav-menu-btn"
                onClick={_this.handleCashDrop}
              />
            </Col>
            <Col xs={12} >

              <Button
                type='primary'
                text='Explore'
                className="nav-menu-btn"
                onClick={_this.handleExplore}
              />
            </Col>
            <Col xs={12} >
              <Button
                type='primary'
                text='Play'
                className="nav-menu-btn"
                onClick={_this.handlePlay}
              />
            </Col>

          </Row>
        </div>
      </section>

    )
  }

  componentDidMount () {
    this.replaceAlphaWarning()
  }

  replaceAlphaWarning () {
    const interval = setInterval(() => {
      try {
        const navbarElem = document.getElementsByClassName('navbar-nav')
        console.log('warningElem', navbarElem)
        if (!navbarElem || !navbarElem.length) throw new Error('Warning alpha not found')
        const children = navbarElem[0].children[0]
        navbarElem[0].removeChild(children)

        const navEle = document.getElementById('nav-btn-menu')
        navEle.style.display = 'flex'
        navEle.className = 'nav-menu-container'
        if (!navEle) throw new Error('navElement  not found')
        navbarElem[0].prepend(navEle)
        clearInterval(interval)
      } catch (error) {
        clearInterval(interval)
        this.replaceAlphaWarning()
      }
    }, 200)
  }

  handleCashDrop () {
    try {
      const cashDropElement = document.getElementById('CashDrop')
      console.log('element', cashDropElement)
      cashDropElement.click()
    } catch (error) {
      console.error(error)
    }
  }

  handleExplore () {
    try {
      const exploreElement = document.getElementById('Explore')
      console.log('element', exploreElement)
      exploreElement.click()
    } catch (error) {
      console.error(error)
    }
  }

  handlePlay () {
    try {
      const playElement = document.getElementById('Play')
      console.log('element', playElement)
      playElement.click()
    } catch (error) {
      console.error(error)
    }
  }
}

export default NavMenu
