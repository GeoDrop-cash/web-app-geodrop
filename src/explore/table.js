/*
  This is a demonstration component. It helps to show how you can create new
  menu items and Views in your own BCH web wallet dashboard app.

  This file controls the View (the part on the right side of the dashboard) of
  the component. The menu item is controlled by the menu-components.js file.
*/

import React from 'react'
import { Row, Col, Box, Button } from 'adminlte-2-react'
import fetch from 'isomorphic-fetch'
import PropTypes from 'prop-types'

let _this
class ExploreTable extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      inFetch: true,
      errMsg: '',
      campaigns: []
    }
  }

  render () {
    const { campaigns, inFetch } = _this.state
    return (
      <>
        <Row>
          <Col xs={12}>
            <Box
              loaded={!inFetch}
              className='border-none explore-table'
            >
              <table>
                <thead>
                  <tr>
                    <th colSpan='2'>Campaigns</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    campaigns.map((val, i) => {
                      return (
                        <tr key={val.merchant + i}>
                          <td>{val.merchant}</td>
                          <td>
                            <Button
                              text='Show on Map'
                              type='primary'
                              className='btn-lg table-btn'
                              onClick={() => _this.showonMap(val)}
                            />
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            </Box>

          </Col>
        </Row>
      </>
    )
  }

  async componentDidMount () {
    await this.handleGetCampaigns()
  }

  async handleGetCampaigns () {
    try {
      const SERVER = process.env.SERVER
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }

      const data = await fetch(`${SERVER}/campaigns`, options)
      const campaigns = await data.json()
      console.log('campaigns', campaigns)
      if (!campaigns && campaigns.campaigns) {
        throw new Error('Campaings not found!')
      }
      _this.setState({
        inFetch: false,
        campaigns: campaigns.campaigns
      })
    } catch (error) {
      _this.setState({
        inFetch: false,
        errMsg: error.message
      })
    }
  }

  showonMap (campaign) {
    try {
      console.log('campaigns to locate', campaign)
      _this.props.onShowCampaign(campaign)
    } catch (error) {

    }
  }
}
ExploreTable.propTypes = {
  onShowCampaign: PropTypes.func
}
export default ExploreTable
