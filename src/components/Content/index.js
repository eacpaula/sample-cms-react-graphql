import * as React from 'react'
import { Box, Container, CssBaseline, Grid, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Header from '../Header'
import Menu from '../Menu'
import Footer from '../Footer'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    backgroundColor: theme.palette.grey[100],
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4)
  },
  paper: {
    minHeight: `calc(100vh - ${theme.spacing(19)}px)`,
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}))

export default function Content(props) {
  const classes = useStyles()
  const { children, title } = props
  const [open, setOpen] = React.useState(true)
  //const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)
  
  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header
        title={title}
        open={open}
        toggleDrawer={toggleDrawer}
      /> 
      <Menu
        open={open}
        toggleDrawer={toggleDrawer}
      />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                { children }
              </Paper>
            </Grid>
          </Grid>
          <Box sx={{ pt: 4 }}>
            <Footer />
          </Box>
        </Container>
      </main>
    </div>
  )
}