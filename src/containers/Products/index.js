import moment from 'moment'
import { React, useState, useEffect, Fragment } from 'react'
import { CircularProgress } from '@material-ui/core'
import { useQuery, useLazyQuery } from '@apollo/client'
import { object, string, number, boolean } from "yup";

import Content from '../../components/Content'
import List from '../../components/List'

import queries from './queries'
import mutations from './mutations'

export default function Products() {
  const [publicPath] = useState(`${process.env.REACT_APP_API_ADDRESS}:${process.env.REACT_APP_API_PORT}/${process.env.REACT_APP_API_PATH_PUBLIC}`)

  const initialState = {
    media_id: "",
    filename: "",
    title: "",
    description: "",
    bootstrap_icon: "",
    content: "",
    available: "true",
  }

  const schema = object().shape({
    media_id: number().required("A imagem do produto é obrigatória!"),
    filename: string().required("A imagem do produto é obrigatória!"),
    title: string().required("O nome do produto é obrigatório!"),
    description: string().required("A descrição do produto é obrigatório!"),
    bootstrap_icon: string().required("O nome do ícone bootstrap do produto é obrigatório!"),
    content: string().required("O conteúdo do produto é obrigatório!"),
    available: boolean().required("A opção disponível é obrigatória!")
	})
	
	const inputs = [
    {
      type: "upload",
      name: "media_id",
      label: "",
      props: {
        placeholder: "Nenhum arquivo selecionado",
      }
    },
    {
      type: "text",
      name: "title",
      label: "Título",
      props: {
        placeholder: "Título do banner",
        style: ""
      }
    },
    {
      type: "text",
      name: "description",
      label: "Descrição",
      props: {
        placeholder: "Descrição do banner",
      }
    },
    {
      type: "text",
      name: "bootstrap_icon",
      label: "Ícone Bootstrap",
      props: {
        placeholder: "Ícone Bootstrap",
      }
    },
    {
      type: "editor",
      name: "content",
      label: "Conteúdo",
      props: {
        placeholder: "Conteúdo",
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
      setState({ columns: state.columns, data: data.products.map(x => Object.assign({}, { ...x, available: x.available.toString()})), actions: state.actions });
    },
		onError: (error) => {
			console.log(error)
		}
  })

  const [loadProducts] = useLazyQuery(queries.GET_DATA, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      setState({ columns: state.columns, data: data.products.map(x => Object.assign({}, { ...x, available: x.available.toString()})), actions: state.actions });
    },
		onError: (error) => {
			console.log(error)
		}
  })

  const handleAdd = (result) => {
    if(result.success)
      loadProducts()
  }

  const handleEdit = (result) => {
    if(result.success)
      loadProducts()
  }

  const handleDelete = (result) => {
    if(result.success)
      loadProducts()
  }

  const [state, setState] = useState({
    columns: [
      { title: 'Id', field: 'id'},
      { title: 'Título', field: 'title'},
      { title: 'Descrição', field: 'description'},
      { title: 'bootstrap_icon', field: 'bootstrap_icon'},
      { title: 'Disponível', field: 'available', type: 'boolean' },
      { title: 'Imagem', field: 'media', render: rowData => <img src={`${publicPath}/${rowData.media.filename}`} style={{width: 50}} alt={rowData.media.filename}/> },
      { title: 'Nome do Arquivo', field: 'filename', hidden: true, render: rowData => rowData.media.filename },
      { title: 'Criado Por', field: 'createdBy', render: rowData => <Fragment> {rowData.createdBy.username} </Fragment> },
      { title: 'Criado Em', field: 'createdAt', render: rowData => <Fragment> { moment(rowData.createdAt).format('DD/MM/YYYY') } </Fragment> },
      { title: 'Atualizado Por', field: 'updatedBy', render: rowData => { <Fragment> { rowData.updatedBy ? rowData.updatedBy.username : "" } </Fragment>} },
      { title: 'Atualizado Em', field: 'updatedAt', render: rowData => { <Fragment> { rowData.updatedAt ? moment(rowData.updatedAt).format('DD/MM/YYYY') : "" } </Fragment>}}
    ],
    data: [],
    actions: [
      { 
        action: 'add', 
        title: "Cadastrar Produto", 
        callback: handleAdd, 
        mutation: { definition: mutations.ADD_DATA, name: 'addProduct' }, 
        inputs, 
        schema, 
        initialState 
      },
      { 
        action: 'edit', 
        title: "Atualizar Produto", 
        callback: handleEdit, 
        mutation: { definition: mutations.UPDATE_DATA, name: 'updateProduct' },
        inputs, 
        schema, 
        initialState 
      },
      { 
        action: 'delete', 
        title: "Deletar Produto", 
        callback: handleDelete, 
        mutation: { definition: mutations.DELETE_DATA, name: 'removeProduct' }
      }
    ] 
  })

  useEffect(() => {
		(async () => {
      if(!state.data)
			  loadProducts()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state])

  return (
    <Content title={'Produtos'}>
      { loading ?
          <CircularProgress disableShrink />
        :
          <List
            title={'Produtos Cadastrados'}
            columns={state.columns} 
            rows={state.data}
            actions={state.actions}
          />
      }
    </Content>
  )
}