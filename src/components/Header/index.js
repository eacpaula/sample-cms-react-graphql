import * as React from 'react'
import { useHistory } from 'react-router-dom'
import clsx from 'clsx'
import { AppBar, Avatar, IconButton, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Menu as MenuIcon, AccountCircle } from '@material-ui/icons'
import { removeData } from '../../helpers/Storage'
import PasswordChanger from '../PasswordChanger'

const drawerWidth = 240
const useStyles = makeStyles((theme) => ({
  toolbar: {
    paddingRight: 24,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  }
}))

export default function Header(props) {
  const classes = useStyles()
  const history = useHistory()
  const [ anchorEl, setAnchorEl ] = React.useState(null)
  const [ passwordChangerOpen, setPasswordChangerOpen ] = React.useState(false)

  const { open, toggleDrawer } = props

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClickPasswordChanger = () => {
		handleClose()
		setPasswordChangerOpen(true)
	}

	const handleClosePasswordChanger = () => {
		setPasswordChangerOpen(false)
	}

  const logoff = () => {
    handleClose()
    removeData()
    history.push('/login')
  }

  return (
    <AppBar
      position={'absolute'}
      className={clsx(classes.appBar, open && classes.appBarShift)}
    >
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge={'start'}
          color={'inherit'}
          aria-label={'open drawer'}
          onClick={toggleDrawer}
          className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          component={'h1'}
          variant={'h6'}
          color={'inherit'}
          noWrap
          className={classes.title}
        >
          {props.title}
        </Typography>
        <IconButton
          aria-label={'more'}
          aria-controls={'user-menu'}
          aria-haspopup={'true'}
          onClick={handleClick}
        >
          <Avatar>
            <AccountCircle />
          </Avatar>
        </IconButton>
        <Menu
          id={'user-menu'}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClickPasswordChanger}>Alterar Senha</MenuItem>
          <MenuItem onClick={logoff}>Sair</MenuItem>
        </Menu>
        <PasswordChanger open={passwordChangerOpen} onClose={handleClosePasswordChanger} />
      </Toolbar>
    </AppBar>
  )
}