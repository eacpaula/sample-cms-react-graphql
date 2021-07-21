import { gql } from '@apollo/client'

const ADD_DATA = gql`
  mutation AddProduct(
    $media_id: Int!
    $title: String!
    $description: String!
    $bootstrap_icon: String!
    $content: String!
    $available: Boolean = true
  ) {
    addProduct(
      data: {
        media_id: $media_id
        title: $title
        description: $description
        bootstrap_icon: $bootstrap_icon
        content: $content
        available: $available
      }
    ) {
      id
    }
  }
`;

const UPDATE_DATA = gql`
  mutation UpdateProduct(
    $id: Int!
    $media_id: Int!
    $title: String!
    $description: String!
    $bootstrap_icon: String!
    $content: String!
    $available: Boolean = true
  ) {
    updateProduct(
      data: {
        id: $id
        media_id: $media_id
        title: $title
        description: $description
        bootstrap_icon: $bootstrap_icon
        content: $content
        available: $available
      }
    ) {
      id
    }
  }
`;

const DELETE_DATA = gql`
  mutation RemoveProduct($id: Int!) {
    removeProduct(id: $id) {
      id
    }
  }
`;

const mutations = {
    ADD_DATA,
    UPDATE_DATA,
    DELETE_DATA
}

export default mutations