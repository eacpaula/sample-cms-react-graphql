import React, { useState, Fragment } from 'react'
import { 
  AddBox, 
  ArrowDownward, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Clear, 
  DeleteOutline, 
  Edit, 
  FilterList, 
  FirstPage, 
  LastPage, 
  Remove, 
  SaveAlt, 
  Search, 
  ViewColumn 
} from '@material-ui/icons'
import { 
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle 
} from '@material-ui/core'
import MaterialTable from 'material-table'
import DeleteDialog from '../DeleteDialog'
import Form from '../Form'

const tableIcons = {
  Add: React.forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: React.forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: React.forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: React.forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: React.forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: React.forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: React.forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: React.forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: React.forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: React.forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: React.forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: React.forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: React.forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: React.forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: React.forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: React.forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: React.forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
}

export default function List(props) {
  const { title, columns, rows, actions } = props
  const [setting, setSetting] = useState({})
  const [open, setOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  const handleCloseDelete = () => {
    setOpenDelete(false)
  }

  let actionsButtons = []

  if(actions) {
    actions.forEach(item => {
      if (item.action === 'add') {
        actionsButtons.push({
          icon: tableIcons['Add'],
          tooltip: 'Adicionar',
          isFreeAction: true,
          onClick: () => {
            setSetting({...item, source: {}})
            setOpen(true) 
          }
        })
      } else if (item.action === 'edit') {
        actionsButtons.push({
          icon: tableIcons['Edit'],
          tooltip: 'Editar',
          onClick: (event, rowData) => {
            let source = rowData
            
            if(!!rowData.media) {
              source.filename = rowData.media.filename_original
            }

            setSetting({...item, source: { ...rowData }})
            setOpen(true) 
          }
        })
      } else if (item.action === 'delete'){
        actionsButtons.push({
          icon: tableIcons['Delete'],
          tooltip: 'Deletar',
          onClick: (event, rowData) => {
            setSetting({...item, source: { ...rowData }})
            setOpenDelete(true) 
          }
        })
      }
    })
  }

  return (
    <Fragment>
      <MaterialTable
        icons={tableIcons}
        title={title}
        options={{
          actionsColumnIndex: -1,
          pageSizeOptions: [10, 25, 50, 100],
          pageSize: 10,
          emptyRowsWhenPaging: false
        }}
        style={{boxShadow: 'none'}}
        columns={columns}
        data={rows}        
        actions={actions ? actionsButtons : false}
        localization={{
          body: {
            emptyDataSourceMessage: 'Nenhum registro encontrado'
          },
          pagination: {
            labelRowsSelect: 'registros por página',
            labelDisplayedRows: '{from}-{to} de {count}',
            firstTooltip: 'Primeira Página',
            previousTooltip: 'Página Anterior',
            nextTooltip: 'Próxima Página',
            lastTooltip: 'Última Página'
          },
          toolbar: {
            searchTooltip: 'Pesquisar',
            searchPlaceholder: 'Pesquisar'
          }
        }}
      />
      {open && (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth={true} maxWidth={"lg"}>
          <DialogTitle id="form-dialog-title">{setting.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{setting.description}</DialogContentText>
            <Form 
              title={setting.title} 
              description={setting.description} 
              source={setting.source} 
              inputs={setting.inputs} 
              schema={setting.schema} 
              callback={setting.callback} 
              mutation={setting.mutation} 
              close={handleClose} 
              initialState={setting.initialState} />
          </DialogContent>
        </Dialog>
      )}
      {openDelete && (
        <DeleteDialog 
          open={openDelete}
          close={handleCloseDelete}
          title={setting.title} 
          description={setting.description} 
          source={setting.source} 
          callback={setting.callback} 
          mutation={setting.mutation} 
        />
      )}
    </Fragment>
    
  )
}