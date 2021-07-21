import { gql } from '@apollo/client'

const GET_DATA = gql`
  query {
    tidings(params: { term: "" }) {
      id
      media_id
      title
      description
      content
      available
      highlight
      publishDate
      expireDate
      createdAt
      updatedAt
      media {
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