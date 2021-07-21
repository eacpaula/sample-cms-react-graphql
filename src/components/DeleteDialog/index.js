import { Fragment, React, useState } from 'react'
import { useMutation } from '@apollo/client'
import {
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  
} from "@material-ui/core";

export default function DeleteDialog(props) {
  const { title, description, source, callback, mutation, open, close } = props;
  const [postMessage, setPostMessage] = useState("");
  const [postMessageStatus, setPostMessageStatus] = useState(false);

  const [mutate, { loading }] = useMutation(mutation.definition, {
    onCompleted: (data) => {
      setPostMessageStatus(true);

      if (data[mutation.name] && data[mutation.name].id) {
        callback({ success: true, data})
        setPostMessage("Ação executada com sucesso!");
      } else {
        callback({ success: false})
        setPostMessage(
          "Houve um erro inesperado ao executar ação desejada, tente novamente mais tarde!"
        );
      }
    },
    onError: (error) => {
      callback({ success: false})
      setPostMessage(
        "Houve um erro inesperado ao executar ação desejada, tente novamente mais tarde!"
      )
    },
  })

  const handleClick = async () => {
    mutate({ variables: { id: parseInt(source.id) } })
  }

	return (
    <Dialog open={open} onClose={close} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
        {loading && <CircularProgress disableShrink />}
        { postMessageStatus ?
            postMessage
          :
            <strong> Você tem certeza que deseja executar a operação solicitada? </strong> 
        }
      </DialogContent>
      <DialogActions>
        { postMessageStatus ? 
            <Button onClick={close} color="primary">
              Fechar
            </Button>
          :
            <Fragment>
              <Button onClick={close} color="primary">
                Cancelar
              </Button>
              <Button onClick={handleClick} color="primary">
                Salvar
              </Button>
            </Fragment>
        }
      </DialogActions>
    </Dialog>
	)
}