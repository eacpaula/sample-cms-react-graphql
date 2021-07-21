import moment from 'moment'
import { React, useState, useEffect, Fragment } from 'react'
import { CircularProgress } from '@material-ui/core'
import { useQuery, useLazyQuery } from '@apollo/client'
import { object, string, number, boolean } from "yup";

import Content from '../../components/Content'
import List from '../../components/List'

import queries from './queries'
import mutations from './mutations'

import segmentQueries from '../Segments/queries'

export default function Clients() {
  const [publicPath] = useState(`${process.env.REACT_APP_API_ADDRESS}:${process.env.REACT_APP_API_PORT}/${process.env.REACT_APP_API_PATH_PUBLIC}`)
  const [segments, setSegments] = useState([]);

  const initialState = {
    media_id: "",
    filename: "",
    segment_id: 1,
    title: "",
    available: true,
  }

  const schema = object().shape({
    media_id: number().required("A imagem do cliente é obrigatória!"),
    filename: string().required("A imagem do cliente é obrigatória!"),
    segment_id: number().required("O segmento do cliente é obrigatório!"),
    title: string().required("O nome do cliente é obrigatório!"),
    available: boolean().required("A opção disponível é obrigatória!")
	})
	
	const [inputs, setInputs] = useState([
    {
      type: "upload",
      name: "media_id",
      label: "",
      props: {
        placeholder: "Nenhum arquivo selecionado",
      }
    },
    {
      type: "select",
      name: "segment_id",
      label: "",
      props: {
        placeholder: "Nenhum segmento selecionado",
      },
      options: segments && segments.length > 0 ? segments.map(x => { return { value: x.id, label: x.title } }) : []
    },
    {
      type: "text",
      name: "title",
      label: "Nome",
      props: {
        placeholder: "Nome do cliente",
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
  ]) 

  const { loading } = useQuery(queries.GET_DATA, {
    onCompleted: (data) => {
      setState({ columns: state.columns, data: data.clients.map(x => Object.assign({}, { ...x })), actions: state.actions });
    },
		onError: (error) => {
			console.log(error)
		}
  })

  const [loadClients] = useLazyQuery(queries.GET_DATA, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      setState({ columns: state.columns, data: data.clients.map(x => Object.assign({}, { ...x })), actions: state.actions });
    },
		onError: (error) => {
			console.log(error)
		}
  })

  const [loadSegments] = useLazyQuery(segmentQueries.GET_DATA, {
    fetchPolicy: 'no-cache',
    // notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setSegments(data.segments)

      let newInputs = [ ...inputs ]
      newInputs[1].options = data.segments.map(x => { return { value: x.id, label: x.title } }) || []

      setInputs(newInputs)
    },
		onError: (error) => {
			console.log(error)
		}
  })

  const handleAdd = (result) => {
    if(result.success)
      loadClients()
  }

  const handleEdit = (result) => {
    if(result.success)
      loadClients()
  }

  const handleDelete = (result) => {
    if(result.success)
      loadClients()
  }

  const [state, setState] = useState({
    columns: [
      { title: 'Id', field: 'id'},
      { title: 'Nome', field: 'title'},
      { title: 'Segmento', field: 'segment_title', hidden: true, render: rowData => rowData.segment.title },
      { title: 'Id do Segmento', field: 'segment_id', hidden: true, render: rowData => rowData.segment.id },
      { title: 'Disponível', field: 'available', type: 'boolean' },
      { title: 'Imagem', field: 'media', render: rowData => <img src={`${publicPath}/${rowData.media.filename}`} style={{width: 50}} alt={rowData.media.filename}/> },
      { title: 'Nome do Arquivo', field: 'filename', hidden: true, render: rowData => rowData.media.filename },
      { title: 'Id do Arquivo', field: 'media_id', hidden: true, render: rowData => rowData.media.id },
      { title: 'Criado Por', field: 'createdBy', render: rowData => <Fragment> {rowData.createdBy.username} </Fragment> },
      { title: 'Criado Em', field: 'createdAt', render: rowData => <Fragment> { moment(rowData.createdAt).format('DD/MM/YYYY') } </Fragment> },
      { title: 'Atualizado Por', field: 'updatedBy', render: rowData => { <Fragment> { rowData.updatedBy ? rowData.updatedBy.username : "" } </Fragment>} },
      { title: 'Atualizado Em', field: 'updatedAt', render: rowData => { <Fragment> { rowData.updatedAt ? moment(rowData.updatedAt).format('DD/MM/YYYY') : "" } </Fragment>}}
    ],
    data: [],
    actions: [
      { 
        action: 'add', 
        title: "Cadastrar Cliente", 
        callback: handleAdd, 
        mutation: { definition: mutations.ADD_DATA, name: 'addClient' }, 
        inputs, 
        schema, 
        initialState 
      },
      { 
        action: 'edit', 
        title: "Atualizar Cliente", 
        callback: handleEdit, 
        mutation: { definition: mutations.UPDATE_DATA, name: 'updateClient' },
        inputs, 
        schema, 
        initialState 
      },
      { 
        action: 'delete', 
        title: "Deletar Cliente", 
        callback: handleDelete, 
        mutation: { definition: mutations.DELETE_DATA, name: 'removeClient' }
      }
    ] 
  })

  useEffect(() => {
		(async () => {
      if(!state.data) {
        loadClients()
      }
    
      if(segments && segments.length <= 0) {
        loadSegments()
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state])

  return (
    <Content title={'Clientes'}>
      { loading ?
          <CircularProgress disableShrink />
        :
          <List
            title={'Clientes Cadastrados'}
            columns={state.columns} 
            rows={state.data}
            actions={state.actions}
          />
      }
    </Content>
  )
}