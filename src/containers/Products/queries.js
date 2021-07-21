import { gql } from '@apollo/client'

const GET_DATA = gql`
  query {
    products(params: { term: "" }) {
      id
      media_id
      title
      description
      bootstrap_icon
      content
      available
      createdAt
      updatedAt
      media {
        id
        filename
        filename_original
      }
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