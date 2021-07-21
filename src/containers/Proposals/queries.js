import { gql } from '@apollo/client'

const GET_DATA = gql`
  query {
    proposals(params: { term: "" }) {
      id
      product_id
      fullname
      email
      cellphone
      message
      createdAt
      product {
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