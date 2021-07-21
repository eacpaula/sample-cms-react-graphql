import moment from 'moment'
import { React, useState, useEffect, Fragment } from 'react'
import { CircularProgress } from '@material-ui/core'
import { useQuery, useLazyQuery } from '@apollo/client'

import Content from '../../components/Content'
import List from '../../components/List'

import queries from './queries'
import mutations from './mutations'

export default function Contacts() {
  const { loading } = useQuery(queries.GET_DATA, {
    onCompleted: (data) => {
      setState({ columns: state.columns, data: data.contacts.map(x => Object.assign({}, x)), actions: state.actions });
    },
		onError: (error) => {
			console.log(error)
		}
  })

  const [loadContacts] = useLazyQuery(queries.GET_DATA, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      setState({ columns: state.columns, data: data.contacts.map(x => Object.assign({}, x)), actions: state.actions });
    },
		onError: (error) => {
			console.log(error)
		}
  })

  const handleDelete = (result) => {
    if(result.success)
      loadContacts()
  }

  const [state, setState] = useState({
    columns: [
      { title: 'Id', field: 'id'},
      { title: 'Assunto', field: 'subject_title', render: rowData => rowData.subject.title },
      { title: 'Assunto Id', field: 'subject_id', hidden: true, render: rowData => rowData.subject.id },
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
        title: "Deletar Contato", 
        callback: handleDelete, 
        mutation: { definition: mutations.DELETE_DATA, name: 'removeContact' }
      }
    ] 
  })

  useEffect(() => {
		(async () => {
      if(!state.data)
        loadContacts()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state])

  return (
    <Content title={'Contatos'}>
      { loading ?
          <CircularProgress disableShrink />
        :
          <List
            title={'Contatos Cadastrados'}
            columns={state.columns} 
            rows={state.data}
            actions={state.actions}
          />
      }
    </Content>
  )
}