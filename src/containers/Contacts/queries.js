import { gql } from '@apollo/client'

const GET_DATA = gql`
  query {
    contacts(params: { term: "" }) {
      id
      subject_id
      fullname
      email
      cellphone
      message
      createdAt
      subject {
        id
        title
      }
    }
  }
`;

const queries = {
  GET_DATA
}

export default queries