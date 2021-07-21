import moment from 'moment'
import { React, useState, useEffect, Fragment } from 'react'
import { CircularProgress } from '@material-ui/core'
import { useQuery, useLazyQuery } from '@apollo/client'
import { object, string, number, boolean } from "yup";

import Content from '../../components/Content'
import List from '../../components/List'

import queries from './queries'
import mutations from './mutations'

export default function Banners() {
  const [publicPath] = useState(`${process.env.REACT_APP_API_ADDRESS}:${process.env.REACT_APP_API_PORT}/${process.env.REACT_APP_API_PATH_PUBLIC}`)

  const initialState = {
    media_id: "",
    filename: "",
    title: "",
    description: "",
    link: "",
    available: "true",
  }

  const schema = object().shape({
    media_id: number().required("A imagem do banner é obrigatória!"),
    filename: string().required("A imagem do banner é obrigatória!"),
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
      name: "link",
      label: "Link",
      props: {
        placeholder: "Link do banner",
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
      setState({ columns: state.columns, data: data.banners.map(x => Object.assign({}, { ...x, available: x.available.toString()})), actions: state.actions });
    },
		onError: (error) => {
			console.log(error)
		}
  })

  const [loadBanners] = useLazyQuery(queries.GET_DATA, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      setState({ columns: state.columns, data: data.banners.map(x => Object.assign({}, { ...x, available: x.available.toString()})), actions: state.actions });
    },
		onError: (error) => {
			console.log(error)
		}
  })

  const handleAdd = (result) => {
    if(result.success)
      loadBanners()
  }

  const handleEdit = (result) => {
    if(result.success)
      loadBanners()
  }

  const handleDelete = (result) => {
    if(result.success)
      loadBanners()
  }

  const [state, setState] = useState({
    columns: [
      { title: 'Id', field: 'id'},
      { title: 'Título', field: 'title'},
      { title: 'Descrição', field: 'description'},
      { title: 'Link', field: 'link'},
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
        title: "Cadastrar Banner", 
        callback: handleAdd, 
        mutation: { definition: mutations.ADD_DATA, name: 'addBanner' }, 
        inputs, 
        schema, 
        initialState 
      },
      { 
        action: 'edit', 
        title: "Atualizar Banner", 
        callback: handleEdit, 
        mutation: { definition: mutations.UPDATE_DATA, name: 'updateBanner' },
        inputs, 
        schema, 
        initialState 
      },
      { 
        action: 'delete', 
        title: "Deletar Banner", 
        callback: handleDelete, 
        mutation: { definition: mutations.DELETE_DATA, name: 'removeBanner' }
      }
    ] 
  })

  useEffect(() => {
		(async () => {
      if(!state.data)
			  loadBanners()
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state])

  return (
    <Content title={'Banners'}>
      { loading ?
          <CircularProgress disableShrink />
        :
          <List
            title={'Banners Cadastrados'}
            columns={state.columns} 
            rows={state.data}
            actions={state.actions}
          />
      }
    </Content>
  )
}