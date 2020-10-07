import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Input, Row, Col, Menu, Dropdown } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const menu = (
  <Menu>
    <Menu.Item>hey</Menu.Item>
    <Menu.Item>boop</Menu.Item>
    <Menu.Item>bloop</Menu.Item>
  </Menu>
)

export function SiteInputRows(props) {
  const [rows, setRows] = useState(props.rows ?? [])
  const handleOnClick = () => setRows([...rows, {}])

  return (
    <div>
      <Row>
        {rows.map((row, i) => {
          return <SiteInputRow key={i} />
        })}
        <Col>
          <Button type="text" onClick={handleOnClick}>
            <PlusOutlined />
            Add Another Site
          </Button>
        </Col>
      </Row>
    </div>
  )
}

function SiteInputRow(props) {
  return (
    <div style={{ margin: '1em' }}>
      <Row>
        <Col>
          <Input />
        </Col>
        <Col>
          <Input />
        </Col>
        <Col>
          <Input />
        </Col>
        <Col>
          <Input />
        </Col>
        <Col>
          <Input />
        </Col>
        <Col>
          <Input />
        </Col>
        <Col>
          <Dropdown overlay={menu}><a className="ant-dropdown-link" onClick={e => e.preventDefault()}>Boops Me</a></Dropdown>
        </Col>
      </Row>
    </div>
  )
}

SiteInputRows.propTypes = {
  rows: PropTypes.array
}
