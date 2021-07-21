import { gql } from '@apollo/client'

const GET_DATA = gql`
  query {
    users(params: { term: "" }) {
      id
      username
      createdAt
      updatedAt
    }
  }
`;

const queries = {
  GET_DATA
}

export default queries