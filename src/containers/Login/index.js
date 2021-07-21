import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Box, Button, CircularProgress, Container, CssBaseline, TextField, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Swal from 'sweetalert2'
import { setData, removeData } from '../../helpers/Storage'
import Footer from '../../components/Footer'
import Logo from '../../logo.svg'
import { useApolloClient, gql } from '@apollo/client'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    margin: theme.spacing(6)
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default function Login() {
  const client = useApolloClient()
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [loading, setLoading] = useState(false)
  const classes = useStyles()
  const history = useHistory()

  const handleSubmit = async(e) => {
    e.preventDefault()
    
    setLoading(true)
    
    removeData()
    
    try{
      const result = await client
        .query({
          query: gql`
            query {
              login(password: "${pass}", username: "${user}")
            }
          `
        })

      setLoading(result.data.loading)

      if(result.data.error)
        await Swal.fire({
          icon: 'error',
          title: 'Error!',
          html: result.data.error.message
        })

      setData({ 
        token: result.data.login,
        username: user
      })

      history.push('/dashboard')
    } catch(err) {
      console.log(err)
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        html: err.message
      })
      
      removeData()
      setLoading(false)
    }
  }

  return (
    <Container component={'main'} maxWidth={'xs'}>
      <CssBaseline />
      <div className={classes.paper}>
        <div className={classes.logo}>
          <img src={Logo} alt="logotipo" style={{ width: "300px"}} />
        </div>
        <Typography component={'h1'} variant={'h5'}>
          CMS Login
        </Typography>
        <form className={classes.form} onSubmit={e => handleSubmit(e)}>
          <TextField
            variant={'outlined'}
            margin={'normal'}
            required
            fullWidth
            id={'username'}
            label={'Usuário'}
            name={'username'}
            type={'text'}
            autoFocus
            onChange={(e) => setUser(e.target.value)}
          />
          <TextField
            variant={'outlined'}
            margin={'normal'}
            required
            fullWidth
            name={'password'}
            label={'Senha'}
            type={'password'}
            id={'password'}
            autoComplete={'current-password'}
            onChange={(e) => setPass(e.target.value)}
          />
          <Button
            type={'submit'}
            fullWidth
            variant={'contained'}
            color={'primary'}
            size={'large'}
            className={classes.submit}
            disabled={loading}
          >
            {loading ?
                <CircularProgress size={24} />
              :
                <span>Entrar</span>
            }
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Footer />
      </Box>
    </Container>
  )
}