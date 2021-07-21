import { gql } from '@apollo/client'

const GET_DATA = gql`
  query {
    employees(params: { term: "" }) {
      id
      media_id
      fullname
      email
      cellphone
      message
      createdAt
      media {
        id
        filename
        filename_original
      }
    }
  }
`;

const queries = {
  GET_DATA
}

export default queries