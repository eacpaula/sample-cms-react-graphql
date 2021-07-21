import moment from 'moment'
import { React, useState, useEffect, Fragment } from 'react'
import { CircularProgress } from '@material-ui/core'
import { useQuery, useLazyQuery } from '@apollo/client'
import { object, string, boolean } from "yup";

import Content from '../../components/Content'
import List from '../../components/List'

import queries from './queries'
import mutations from './mutations'

export default function Subjects() {
  const initialState = {
    title: "",
    emails: "",
    available: "true",
  }

  const schema = object().shape({
    title: string().required("O nome da área é obrigatória!"),
    emails: string().required("Os emails da área são obrigatórios!"),
    available: boolean().required("A opção disponível é obrigatória!")
	})
	
	const inputs = [
    {
      type: "text",
      name: "title",
      label: "Título",
      props: {
        placeholder: "Título da Área",
        style: ""
      }
    },
    {
      type: "text",
      name: "emails",
      label: "Emails",
      props: {
        placeholder: "Emails da Área",
      }
    },
    {
      type: "radio",
      name: "available",
      label: "Disponível",
      defaultValue: "true",
      props: {
      },
      options: [
        { label: "Sim", value: "true"},
        { label: "Não", value: "false"}
      ]
    },
  ]
  
  const { loading } = useQuery(queries.GET_DATA, {
    onCompleted: (data) => {
      setState({ columns: state.columns, data: data.subjects.map(x => Object.assign({}, { ...x, available: x.available.toString()})), actions: state.actions });
    },
		onError: (error) => {
			console.log(error)
		}
  })

  const [loadSubjects] = useLazyQuery(queries.GET_DATA, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      setState({ columns: state.columns, data: data.subjects.map(x => Object.assign({}, { ...x, available: x.available.toString()})), actions: state.actions });
    },
		onError: (error) => {
			console.log(error)
		}
  })

  const handleAdd = (result) => {
    if(result.success)
      loadSubjects()
  }

  const handleEdit = (result) => {
    if(result.success)
      loadSubjects()
  }

  const handleDelete = (result) => {
    if(result.success)
      loadSubjects()
  }

  const [state, setState] = useState({
    columns: [
      { title: 'Id', field: 'id'},
      { title: 'Título', field: 'title'},
      { title: 'Emails', field: 'emails'},
      { title: 'Disponível', field: 'available', type: 'boolean' },
      { title: 'Criado Por', field: 'createdBy', render: rowData => <Fragment> {rowData.createdBy.username} </Fragment> },
      { title: 'Criado Em', field: 'createdAt', render: rowData => <Fragment> { moment(rowData.createdAt).format('DD/MM/YYYY') } </Fragment> },
      { title: 'Atualizado Por', field: 'updatedBy', render: rowData => { <Fragment> { rowData.updatedBy ? rowData.updatedBy.username : "" } </Fragment>} },
      { title: 'Atualizado Em', field: 'updatedAt', render: rowData => { <Fragment> { rowData.updatedAt ? moment(rowData.updatedAt).format('DD/MM/YYYY') : "" } </Fragment>}}
    ],
    data: [],
    actions: [
      { 
        action: 'add', 
        title: "Cadastrar Assunto", 
        callback: handleAdd, 
        mutation: { definition: mutations.ADD_DATA, name: 'addSubject' }, 
        inputs, 
        schema, 
        initialState 
      },
      { 
        action: 'edit', 
        title: "Atualizar Assunto", 
        callback: handleEdit, 
        mutation: { definition: mutations.UPDATE_DATA, name: 'updateSubject' },
        inputs, 
        schema, 
        initialState 
      },
      { 
        action: 'delete', 
        title: "Deletar Assunto", 
        callback: handleDelete, 
        mutation: { definition: mutations.DELETE_DATA, name: 'removeSubject' }
      }
    ] 
  })

  useEffect(() => {
		(async () => {
      if(!state.data)
        loadSubjects()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state])

  return (
    <Content title={'Assunto'}>
      { loading ?
          <CircularProgress disableShrink />
        :
          <List
            title={'Assuntos Cadastrados'}
            columns={state.columns} 
            rows={state.data}
            actions={state.actions}
          />
      }
    </Content>
  )
}