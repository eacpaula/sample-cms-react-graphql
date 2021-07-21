import { gql } from '@apollo/client'

const GET_DATA = gql`
  query {
    clients(params: { term: "" }) {
      id
      segment_id
      media_id
      title
      available
      createdAt
      updatedAt
      media {
        id
        filename
        filename_original
      }
      segment {
        id
        title
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