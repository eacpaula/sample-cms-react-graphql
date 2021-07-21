import * as React from 'react'
import Orders from './Orders'
import Content from '../../components/Content'

export default function Dashboard() {
  return (
    <Content title={'Dashboard'}>
      <Orders />
    </Content>
  )
}
