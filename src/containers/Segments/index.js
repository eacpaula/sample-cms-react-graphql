import moment from 'moment'
import { React, useState, useEffect, Fragment } from 'react'
import { CircularProgress } from '@material-ui/core'
import { useQuery, useLazyQuery } from '@apollo/client'
import { object, string, boolean } from "yup";

import Content from '../../components/Content'
import List from '../../components/List'

import queries from './queries'
import mutations from './mutations'

export default function Segments() {
  const initialState = {
    title: "",
    available: "true",
  }

  const schema = object().shape({
    title: string().required("O nome da área é obrigatória!"),
    available: boolean().required("A opção disponível é obrigatória!")
	})
	
	const inputs = [
    {
      type: "text",
      name: "title",
      label: "Título",
      props: {
        placeholder: "Título do Segmento",
        style: ""
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
      setState({ columns: state.columns, data: data.segments.map(x => Object.assign({}, { ...x, available: x.available.toString()})), actions: state.actions });
    },
		onError: (error) => {
			console.log(error)
		}
  })

  const [loadSegments] = useLazyQuery(queries.GET_DATA, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      setState({ columns: state.columns, data: data.segments.map(x => Object.assign({}, { ...x, available: x.available.toString()})), actions: state.actions });
    },
		onError: (error) => {
			console.log(error)
		}
  })

  const handleAdd = (result) => {
    if(result.success)
      loadSegments()
  }

  const handleEdit = (result) => {
    if(result.success)
      loadSegments()
  }

  const handleDelete = (result) => {
    if(result.success)
      loadSegments()
  }

  const [state, setState] = useState({
    columns: [
      { title: 'Id', field: 'id'},
      { title: 'Título', field: 'title'},
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
        title: "Cadastrar Segmento", 
        callback: handleAdd, 
        mutation: { definition: mutations.ADD_DATA, name: 'addSegment' }, 
        inputs, 
        schema, 
        initialState 
      },
      { 
        action: 'edit', 
        title: "Atualizar Segmento", 
        callback: handleEdit, 
        mutation: { definition: mutations.UPDATE_DATA, name: 'updateSegment' },
        inputs, 
        schema, 
        initialState 
      },
      { 
        action: 'delete', 
        title: "Deletar Segmento", 
        callback: handleDelete, 
        mutation: { definition: mutations.DELETE_DATA, name: 'removeSegment' }
      }
    ] 
  })

  useEffect(() => {
		(async () => {
      if(!state.data)
        loadSegments()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state])

  return (
    <Content title={'Segmentos'}>
      { loading ?
          <CircularProgress disableShrink />
        :
          <List
            title={'Segmentos Cadastrados'}
            columns={state.columns} 
            rows={state.data}
            actions={state.actions}
          />
      }
    </Content>
  )
}