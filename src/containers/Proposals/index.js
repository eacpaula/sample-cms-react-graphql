import moment from 'moment'
import { React, useState, useEffect, Fragment } from 'react'
import { CircularProgress } from '@material-ui/core'
import { useQuery, useLazyQuery } from '@apollo/client'

import Content from '../../components/Content'
import List from '../../components/List'

import queries from './queries'
import mutations from './mutations'

export default function Proposals() {
  const { loading } = useQuery(queries.GET_DATA, {
    onCompleted: (data) => {
      setState({ columns: state.columns, data: data.proposals.map(x => Object.assign({}, x)), actions: state.actions });
    },
		onError: (error) => {
			console.log(error)
		}
  })

  const [loadProposals] = useLazyQuery(queries.GET_DATA, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      setState({ columns: state.columns, data: data.proposals.map(x => Object.assign({}, x)), actions: state.actions });
    },
		onError: (error) => {
			console.log(error)
		}
  })

  const handleDelete = (result) => {
    if(result.success)
      loadProposals()
  }

  const [state, setState] = useState({
    columns: [
      { title: 'Id', field: 'id'},
      { title: 'Produto', field: 'product_title', render: rowData => rowData.product.title },
      { title: 'Produto Id', field: 'product_id', hidden: true, render: rowData => rowData.product.id },
      { title: 'Nome Completo', field: 'fullname'},
      { title: 'Email', field: 'email'},
      { title: 'Celular', field: 'cellphone'},
      { title: 'Mensagem', field: 'message' },
      { title: 'Criado Em', field: 'createdAt', render: rowData => <Fragment> { moment(rowData.createdAt).format('DD/MM/YYYY') } </Fragment> },
    ],
    data: [],
    actions: [
      { 
        action: 'delete', 
        title: "Deletar Proposta", 
        callback: handleDelete, 
        mutation: { definition: mutations.DELETE_DATA, name: 'removeProposal' }
      }
    ] 
  })

  useEffect(() => {
		(async () => {
      if(!state.data)
        loadProposals()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state])

  return (
    <Content title={'Solicitações de Apresentação'}>
      { loading ?
          <CircularProgress disableShrink />
        :
          <List
            title={'Solicitações de Apresentação Cadastradas'}
            columns={state.columns} 
            rows={state.data}
            actions={state.actions}
          />
      }
    </Content>
  )
}