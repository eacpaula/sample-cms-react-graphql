import uuid from 'react-uuid'
import { React, useState, Fragment } from "react"
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-decoupled-document'
import InputMask from "react-input-mask"
import { useForm, Controller } from "react-hook-form"
import { useMutation } from '@apollo/client'
import { yupResolver } from "@hookform/resolvers/yup"
import {
  CircularProgress,
  Button,
  DialogActions,
  FormGroup,
  FormLabel,
  FormControl,
  Grid,
  TextField,
  Input,
  IconButton,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel
} from "@material-ui/core"
import Alert from '@material-ui/lab/Alert'
import * as Components from "@material-ui/core"
import CloseIcon from '@material-ui/icons/Close'

import UploadFile from "../UploadFile"
import UploadAdapter from '../../adapters/UploadAdapter'

export default function Form(props) {
  const { source, inputs, schema, callback, mutation, initialState, close } = props
  const [filename, setFilename] = useState(source && source.filename && source.filename.length > 0 ? source.filename : "")
	const [maxFileSizeAlertStatus, setMaxFileSizeAlertStatus] = useState(false)
	const [maxFileSizeAlertMessage, setMaxFileSizeAlertMessage] = useState("")
  const [submitMessage, setSubmitMessage] = useState("")
  const [submitMessageStatus, setSubmitMessageStatus] = useState(false)
  const [submitMessageType, setSubmitMessageType] = useState("")

  function CustomUploadAdapterPlugin(editor){
    editor.plugins.get( 'FileRepository' ).createUploadAdapter = (loader) => {
      return new UploadAdapter(loader)
    }
  }

  const custom_config = {
    extraPlugins: [ CustomUploadAdapterPlugin ],
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        'alignment',
        '|',
        'blockQuote',
        'insertTable',
        '|',
        'imageUpload',
        'imageStyle:alignLeft', 'imageStyle:alignRight', 'imageStyle:full', 'imageStyle:side',
        'imageTextAlternative',
        '|',
        'undo',
        'redo'
      ]
    },
    image: {
      styles: [
        'side',
        'full',
        'alignLeft',
        'alignRight'
      ],
      toolbar: [
        'imageStyle:alignLeft',
        'imageStyle:full',
        'imageStyle:alignRight',
        'imageStyle:side',
        '|',
        'imageTextAlternative'
      ]
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells'
      ]
    },
  }

  const [mutate, { loading }] = useMutation(mutation.definition, {
    onCompleted: (data) => {
      setSubmitMessageStatus(true)

      if (data[mutation.name] && data[mutation.name].id) {
        callback({ success: true, data})
        setSubmitMessage("Ação executada com sucesso!")
        setSubmitMessageType("success")
      } else {
        callback({ success: false})
        setSubmitMessage(
          "Houve um erro inesperado ao executar ação desejada, tente novamente mais tarde!"
        )
        setSubmitMessageType("error")
      }
    },
    onError: (error) => {
      setSubmitMessageStatus(true)
      callback({ success: false})
      setSubmitMessage(
        "Houve um erro inesperado ao executar ação desejada, tente novamente mais tarde!"
      )
      setSubmitMessageType("error")
    },
  })

  const { register, handleSubmit, errors, control } = useForm({
    mode: 'onSubmit',
    defaultValues: Object.keys(source).length > 0 ?  source : initialState,
  	reValidateMode: 'onChange',
		resolver: yupResolver(schema),
		criteriaMode: "firstError",
		shouldFocusError: true,
		shouldUnregister: true,
	})

  const onSubmit = async (data, e) => {
    let variables = source.id ? { id: parseInt(source.id), ...data } : { ...data }
    mutate({ variables: variables })
  }

  const onError = (errors, e) => {
    console.log(errors, e)
  }

  const handleFileUploadCallback = (data) => {
		if(data.success) {
			setMaxFileSizeAlertStatus(false)
			setFilename(data.filename_original)
		}
		else {
			setMaxFileSizeAlertStatus(true)
			setMaxFileSizeAlertMessage(data.message)
		}
  }

  const buildField = (input, index) => {
    switch (input.type) {
      case 'text':
        return <TextField
                placeholder={input.props.placeholder}
                name={input.name}
                label={input.label}
                error={!!errors[input.name]}
                helperText={
                  errors[input.name] ? errors[input.name].message : ""
                }
                inputRef={register}
              />
            
      case 'date':
        return <Controller
                control={control}
                name={input.name}
                render={(
                  { onChange, value, ref }
                ) => (
                  <TextField
                    type="date"
                    placeholder={input.props.placeholder}
                    label={input.label}
                    error={!!errors[input.name]}
                    helperText={
                      errors[input.name] ? errors[input.name].message : ""
                    }
                    value={value}
                    onChange={ ( e ) => {
                      onChange(e.target.value)
                    }}
                    inputRef={ref}
                  />
                )}
              /> 

      case 'datetime':
        return <TextField
                type="datetime-local"
                placeholder={input.props.placeholder}
                name={input.name}
                label={input.label}
                error={!!errors[input.name]}
                helperText={
                  errors[input.name] ? errors[input.name].message : ""
                }
                inputRef={register}
              />

      case 'time':
        return <TextField
                type="time"
                placeholder={input.props.placeholder}
                name={input.name}
                label={input.label}
                error={!!errors[input.name]}
                helperText={
                  errors[input.name] ? errors[input.name].message : ""
                }
                inputRef={register}
              />

      case 'editor':
        return<Fragment>
                <FormLabel>{input.label}</FormLabel> 
                <Controller
                  control={control}
                  name={input.name}
                  render={(
                    { onChange, onBlur, value, name, ref },
                    { invalid, isTouched, isDirty }
                  ) => (
                    <CKEditor
                      editor={ ClassicEditor }
                      config={custom_config}
                      data={value}
                      onReady={ editor => {
                        editor.ui.getEditableElement().parentElement.insertBefore(
                            editor.ui.view.toolbar.element,
                            editor.ui.getEditableElement()
                        );
                      } }
                      onChange={ ( event, editor ) => {
                          const data = editor.getData()
                          onChange(data)
                      } }
                      // onBlur={ ( event, editor ) => {
                      //     console.log( 'Blur.', editor )
                      // } }
                      // onFocus={ ( event, editor ) => {
                      //   console.log( 'Focus.', editor )
                      // } }
                    />
                  )}
                />
              </Fragment>
      
      case 'select':
        return <Controller
                control={control}
                name={input.name}
                as={
                  <Select 
                    placeholder={input.props.placeholder}
                    label={input.label}>
                      {input.options && input.options.map((item) => 
                        <MenuItem value={item.value} key={uuid()}>{item.label}</MenuItem>
                      )}
                  </Select>
                }
              /> 
      
      case 'radio':
        return  <Fragment>
                  <FormLabel>{input.label}</FormLabel>
                  <Controller
                    control={control}
                    name={input.name}
                    as={
                      <RadioGroup aria-label={input.name}>
                        {input.options && input.options.map((item) => 
                          <FormControlLabel value={item.value} control={<Radio />} label={item.label} key={uuid()} />
                        )}
                      </RadioGroup>
                    }
                  />
                </Fragment>

      case 'mask':
        return <InputMask mask={input.props.mask}>
                {(inputProps) => <Input {...inputProps} 
                                    type="tel" 
                                    placeholder={input.props.placeholder}
                                    name={input.name}
                                    label={input.label}
                                    error={!!errors[input.name]}
                                    helperText={ errors[input.name] ? errors[input.name].message : ""}
                                    inputRef={register}
                                    disableUnderline />
                }
              </InputMask>

      case 'upload':
        return <Fragment>
                  <TextField
                    placeholder={input.props.placeholder}
                    name="filename"
                    label="Arquivo"
                    error={!!errors.filename}
                    helperText={
                      errors.filename ? errors.filename.message : maxFileSizeAlertStatus ? maxFileSizeAlertMessage : ""
                    }
                    inputRef={register}
                    value={filename}
                    inputProps={{
                      readOnly: Boolean(true)
                    }}
                  />
                  <Controller
                    control={control}
                    name={input.name}
                    render={(
                      { onChange, value, ref }
                    ) => (
                      <UploadFile 
                        name={input.name}
                        inputRef={ref}
                        value={value}
                        handleOnChange={onChange}
                        callback={handleFileUploadCallback}/>
                    )}
                  />
               </Fragment>

      default:
        React.createElement(Components[input.component], input.props)
    }
  }

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <Grid container direction={"column"} spacing={2}>
          { Array.isArray(inputs) && inputs.map((input, index) =>
              <Grid item key={index}>
                <FormGroup>
                  <FormControl>
                    {buildField(input, index)}
                  </FormControl>
                </FormGroup>
              </Grid>
            )
          }
        </Grid>
        <div style={{ marginTop: '20px' }} >
          {loading && <CircularProgress disableShrink />}
          { submitMessageStatus && (
            <Alert
              variant="outlined" 
              severity={submitMessageType}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setSubmitMessageStatus(false)
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {submitMessage}
            </Alert>
          )}
        </div>
      </form>
      <DialogActions>
        { submitMessageStatus && submitMessageType === 'success' ? 
            <Button onClick={close} color="primary">
              Fechar
            </Button>
          :
            <Fragment>
              <Button onClick={close} color="primary">
                Cancelar
              </Button>
              <Button onClick={handleSubmit(onSubmit, onError)} color="primary">
                Salvar
              </Button>
            </Fragment>
        }
        
      </DialogActions>
    </Fragment>
  )
}