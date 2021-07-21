import moment from 'moment'
import { React, useState, useEffect, Fragment } from 'react'
import { CircularProgress } from '@material-ui/core'
import { useQuery, useLazyQuery } from '@apollo/client'
import { object, string, number, boolean, date } from "yup";

import Content from '../../components/Content'
import List from '../../components/List'

import queries from './queries'
import mutations from './mutations'

import { parseDateString } from '../../helpers/DateValidations'

export default function News() {
  const [publicPath] = useState(`${process.env.REACT_APP_API_ADDRESS}:${process.env.REACT_APP_API_PORT}/${process.env.REACT_APP_API_PATH_PUBLIC}`)

  const initialState = {
    media_id: "",
    filename: "",
    title: "",
    description: "",
    content: "",
    available: "true",
    highlight: "true",
    publishDate: moment().format('YYYY-MM-DD'),
    expireDate: moment().format('YYYY-MM-DD')
  }

  const schema = object().shape({
    media_id: number().required("A imagem da notícia é obrigatória!"),
    filename: string().required("A imagem da notícia é obrigatória!"),
    title: string().required("O nome da notícia é obrigatório!"),
    description: string().required("A descrição da notícia é obrigatória!"),
    content: string().required("O conteúdo da notícia é obrigatório!"),
    available: boolean().required("A opção disponível é obrigatória!"),
    highlight: boolean().required("A opção destaque é obrigatória!"),
    publishDate: date().transform(parseDateString).required("A data de publicação é obrigatória!"),
    expireDate: date().transform(parseDateString).required("A data de expiração é obrigatória!")
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
        placeholder: "Título da Notícia",
        style: ""
      }
    },
    {
      type: "text",
      name: "description",
      label: "Descrição",
      props: {
        placeholder: "Descrição da Notícia",
      }
    },
    {
      type: "editor",
      name: "content",
      label: "Conteúdo",
      props: {
        placeholder: "Conteúdo da Notícia",
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
    {
      type: "radio",
      name: "highlight",
      label: "Destaque",
      defaultValue: "true",
      props: {
      },
      options: [
        { label: "Sim", value: "true"},
        { label: "Não", value: "false"}
      ]
    },
    {
      type: "date",
      name: "publishDate",
      label: "Data de Publicação",
      props: {
      }
    },
    {
      type: "date",
      name: "expireDate",
      label: "Data de Expiração",
      props: {
      }
    },
  ]
  
  const { loading } = useQuery(queries.GET_DATA, {
    onCompleted: (data) => {
      setState({ 
        columns: state.columns, 
        data: data.tidings.map(x => Object.assign({}, { 
          ...x, 
          available: x.available.toString(),
          highlight: x.highlight.toString(),
          publishDate: moment(x.publishDate).format('YYYY-MM-DD'),
          expireDate: moment(x.expireDate).format('YYYY-MM-DD')
        })), 
        actions: state.actions 
      })
    },
		onError: (error) => {
			console.log(error)
		}
  })

  const [loadNews] = useLazyQuery(queries.GET_DATA, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      setState({ 
        columns: state.columns, 
        data: data.tidings.map(x => Object.assign({}, { 
          ...x, 
          available: x.available.toString(),
          highlight: x.highlight.toString(),
          publishDate: moment(x.publishDate).format('YYYY-MM-DD'),
          expireDate: moment(x.expireDate).format('YYYY-MM-DD')
        })), 
        actions: state.actions 
      })
    },
		onError: (error) => {
			console.log(error)
		}
  })

  const handleAdd = (result) => {
    if(result.success)
      loadNews()
  }

  const handleEdit = (result) => {
    if(result.success)
      loadNews()
  }

  const handleDelete = (result) => {
    if(result.success)
      loadNews()
  }

  const [state, setState] = useState({
    columns: [
      { title: 'Id', field: 'id'},
      { title: 'Título', field: 'title'},
      { title: 'Descrição', field: 'description'},
      { title: 'Disponível', field: 'available', type: 'boolean' },
      { title: 'Destaque', field: 'highlight', type: 'boolean' },
      { title: 'Imagem', field: 'media', render: rowData => <img src={`${publicPath}/${rowData.media.filename}`} style={{width: 50}} alt={rowData.media.filename}/> },
      { title: 'Nome do Arquivo', field: 'filename', hidden: true, render: rowData => rowData.media.filename },
      { title: 'Publicação Em', field: 'publishDate', render: rowData => rowData.publishDate },
      { title: 'Expiração Em', field: 'expireDate', render: rowData => rowData.expireDate },
      { title: 'Criado Por', field: 'createdBy', render: rowData => <Fragment> {rowData.createdBy.username} </Fragment> },
      { title: 'Criado Em', field: 'createdAt', render: rowData => <Fragment> { moment(rowData.createdAt).format('DD/MM/YYYY') } </Fragment> },
      { title: 'Atualizado Por', field: 'updatedBy', render: rowData => { <Fragment> { rowData.updatedBy ? rowData.updatedBy.username : "" } </Fragment>} },
      { title: 'Atualizado Em', field: 'updatedAt', render: rowData => { <Fragment> { rowData.updatedAt ? moment(rowData.updatedAt).format('DD/MM/YYYY') : "" } </Fragment>}}
    ],
    data: [],
    actions: [
      { 
        action: 'add', 
        title: "Cadastrar Notícia", 
        callback: handleAdd, 
        mutation: { definition: mutations.ADD_DATA, name: 'addNews' }, 
        inputs, 
        schema, 
        initialState 
      },
      { 
        action: 'edit', 
        title: "Atualizar Notícia", 
        callback: handleEdit, 
        mutation: { definition: mutations.UPDATE_DATA, name: 'updateNews' },
        inputs, 
        schema, 
        initialState 
      },
      { 
        action: 'delete', 
        title: "Deletar Notícia", 
        callback: handleDelete, 
        mutation: { definition: mutations.DELETE_DATA, name: 'removeNews' }
      }
    ] 
  })

  useEffect(() => {
		(async () => {
      if(!state.data)
        loadNews()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state])

  return (
    <Content title={'Notícias'}>
      { loading ?
          <CircularProgress disableShrink />
        :
          <List
            title={'Notícias Cadastradas'}
            columns={state.columns} 
            rows={state.data}
            actions={state.actions}
          />
      }
    </Content>
  )
}