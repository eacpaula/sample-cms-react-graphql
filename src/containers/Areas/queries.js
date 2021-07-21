import { gql } from '@apollo/client'

const GET_DATA = gql`
  query {
    areas(params: { term: "" }) {
      id
      title
      emails
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