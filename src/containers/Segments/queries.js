import { gql } from '@apollo/client'

const GET_DATA = gql`
  query {
    segments(params: { term: "" }) {
      id
      title
      available
      createdAt
      updatedAt
      createdBy {
        username
      }
      updatedBy {
        username
      }
    }
  }
`;

const queries = {
  GET_DATA
}

export default queries