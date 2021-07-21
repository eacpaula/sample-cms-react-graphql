import React from 'react'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { ptBR } from '@material-ui/core/locale'
import Router from './router'
import Theme from './configs/theme'

export default function App() {
  const themeConfig = createMuiTheme(Theme, ptBR)

  return (
    <ThemeProvider theme={themeConfig}>
      <Router />
    </ThemeProvider>
  )
}