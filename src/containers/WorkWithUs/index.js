import moment from 'moment'
import { React, useState, useEffect, Fragment } from 'react'
import { CircularProgress } from '@material-ui/core'
import { useQuery, useLazyQuery } from '@apollo/client'

import Content from '../../components/Content'
import List from '../../components/List'

import queries from './queries'
import mutations from './mutations'

export default function WorkWithUs() {
  const [publicPath] = useState(`${process.env.REACT_APP_API_ADDRESS}:${process.env.REACT_APP_API_PORT}/${process.env.REACT_APP_API_PATH_PUBLIC}`)

  const { loading } = useQuery(queries.GET_DATA, {
    onCompleted: (data) => {
      setState({ columns: state.columns, data: data.employees.map(x => Object.assign({}, x)), actions: state.actions });
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
      { title: 'Currículo', field: 'media', render: rowData => <a href={`${publicPath}/${rowData.media.filename}`} target="_blank" rel="noreferrer">{rowData.media.filename_original}</a> },
      { title: 'Nome do Arquivo', field: 'filename', hidden: true, render: rowData => rowData.media.filename },
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
    <Content title={'Solicitações de Trabalho Conosco'}>
      { loading ?
          <CircularProgress disableShrink />
        :
          <List
            title={'Solicitações de Trabalhe Conosco Cadastradas'}
            columns={state.columns} 
            rows={state.data}
            actions={state.actions}
          />
      }
    </Content>
  )
}