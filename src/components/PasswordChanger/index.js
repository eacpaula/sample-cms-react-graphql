import React from "react";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Typography,
} from "@material-ui/core";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { yupResolver } from "@hookform/resolvers/yup";
import { useHistory } from 'react-router-dom'
import Swal from "sweetalert2";

import mutations from "./mutations";
import { getData, removeData } from '../../helpers/Storage'

export default function PasswordChanger(props) {
  const { onClose, open } = props;
  const history = useHistory()

  const storage = getData()

  const initialState = {
    username: storage.username,
    password_old: "",
    password: "",
    password_confirmation: ""
  }

  const schema = object().shape({
    username: string().required("O username é obrigatório!").nullable(),
    password_old: string().required("A senha antiga é obrigatória!"),
    password: string().required("A nova senha é obrigatória!"),
    password_confirmation: string().required("A confirmação da nova senha é obrigatória!")
  })

  const { register, handleSubmit, errors } = useForm({
    mode: "onSubmit",
    defaultValues: initialState,
    reValidateMode: "onChange",
    resolver: yupResolver(schema),
    criteriaMode: "firstError",
    shouldFocusError: true,
    shouldUnregister: true,
  })

  const [mutate, { loading }] = useMutation(mutations.CHANGE_PASSWORD, {
    onCompleted: (data) => {
		if(data.changePassword.id) {
			Swal.fire({
				icon: "success",
				title: "Sucesso!",
				text: "Senha alterada com sucesso!"
			}).then((result) => {
				if (result.isConfirmed) {
					onClose()
					removeData()
    				history.push('/login')
				}
			})
		} else {
			Swal.fire({
				icon: "error",
				title: "Erro!",
				text: "Houve um erro inesperado ao processar a solicitação de alteração de senha, tente novamente mais tarde!"
			})
		}
    },
    onError: (error) => {
		Swal.fire({
			icon: "error",
			title: "Erro!",
			text: error.message
		})
    }
  })

  const onSubmit = async (data, e) => {
	if (data.password !== data.password_confirmation) {
		Swal.fire({
			icon: "error",
			title: "Erro!",
			text: "O campo senha e confirmação devem ser iguais."
		})
	} else {	
		let variables = { ...data }
    	mutate({ variables: variables })
	}	
  }

  const onError = (errors, e) => {
    console.log(errors, e)
  }

  return (
    <Dialog
      classes={{ paper: "filter" }}
      open={open}
      onClose={onClose}
      aria-labelledby={"form-dialog-title"}
    >
      <form onSubmit={handleSubmit(onSubmit, onError)} autoComplete={"off"}>
        <DialogTitle
          id={"form-dialog-title"}
          color={"primary"}
          children={
            <Typography className={"MuiTypography-h6"} color={"primary"}>
              Alterar Senha
            </Typography>
          }
        />
        <DialogContent className={"form"}>
			<TextField
				id={"username"}
				name={"username"}
				label={"Username"}
				type={"text"}
				fullWidth
				margin={"normal"}
				InputLabelProps={{
				shrink: true,
				}}
				helperText={
					errors['username'] ? errors['username'].message : ""
				}
				inputRef={register}
			/>
			<TextField
				id={"password_old"}
				name={"password_old"}
				label={"Senha Atual"}
				type={"password"}
				fullWidth
				margin={"normal"}
				InputLabelProps={{
				shrink: true,
				}}
				helperText={
					errors['password_old'] ? errors['password_old'].message : ""
				}
				inputRef={register}
			/>
			<TextField
				id={"password"}
				name={"password"}
				label={"Nova Senha"}
				type={"password"}
				fullWidth
				margin={"normal"}
				InputLabelProps={{
				shrink: true,
				}}
				helperText={
					errors['password'] ? errors['password'].message : ""
				}
				inputRef={register}
			/>
			<TextField
				id={"password_confirmation"}
				name={"password_confirmation"}
				label={"Confirmação de Senha"}
				type={"password"}
				fullWidth
				margin={"normal"}
				InputLabelProps={{
				shrink: true,
				}}
				helperText={
					errors['password_confirmation'] ? errors['password_confirmation'].message : ""
				}
				inputRef={register}
			/>
        </DialogContent>
        <DialogActions>
          <Button
            type={"button"}
            onClick={onClose}
            color={"secondary"}
            disabled={loading}
          >
            Fechar
          </Button>
          <Button type={"submit"} color={"primary"} disabled={loading}>
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}