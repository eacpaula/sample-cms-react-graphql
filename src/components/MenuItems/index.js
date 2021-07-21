import * as React from 'react'
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { 
  AccountBalance, 
  AccountBox, 
  ArtTrack, 
  AspectRatio, 
  Dashboard, 
  Email, 
  People, 
  PictureAsPdf, 
  QuestionAnswer, 
  SupervisedUserCircle, 
  Work, 
  ViewCarousel 
} from '@material-ui/icons'
import { Link } from 'react-router-dom'

function ListItemLink(props) {
  const { icon, primary, to } = props;

  const CustomLink = props => <Link to={to} {...props} />;

  return (
    <li>
      <ListItem button component={CustomLink}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  )
}

export default function MenuItems() {
  return (
    <div>
      <ListItem button>
        <ListItemIcon>
          <Dashboard />
        </ListItemIcon>
        <ListItemText primary={'Dashboard'} />
      </ListItem>

      <ListItemLink
        icon={<AspectRatio />}
        primary={'Áreas'}
        to={'/areas'}
      />
      <ListItemLink
        icon={<ViewCarousel />}
        primary={'Banners'}
        to={'/banners'}
      />
      <ListItemLink
        icon={<People />}
        primary={'Clientes'}
        to={'/clients'}
      />
      <ListItemLink
        icon={<Email />}
        primary={'Contatos'}
        to={'/contacts'}
      />
      <ListItemLink
        icon={<ArtTrack />}
        primary={'Notícias'}
        to={'/news'}
      />
      <ListItemLink
        icon={<Work />}
        primary={'Produtos'}
        to={'/products'}
      />
      <ListItemLink
        icon={<QuestionAnswer />}
        primary={'Propostas'}
        to={'/proposals'}
      />
      <ListItemLink
        icon={<AccountBalance />}
        primary={'Segmentos'}
        to={'/segments'}
      />
      <ListItemLink
        icon={<AccountBox />}
        primary={'Assuntos'}
        to={'/subjects'}
      />
      <ListItemLink
        icon={<PictureAsPdf />}
        primary={'Trabalhe Conosco'}
        to={'/work-with-us'}
      />
      <ListItemLink
        icon={<SupervisedUserCircle />}
        primary={'Usuários'}
        to={'/users'}
      />
    </div>
  )
}