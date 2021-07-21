import { gql } from '@apollo/client'

const ADD_DATA = gql`
  mutation AddClient(
    $media_id: Int!
    $segment_id: Int!
    $title: String!
    $available: Boolean = true
  ) {
    addClient(
      data: {
        media_id: $media_id
        segment_id: $segment_id
        title: $title
        available: $available
      }
    ) {
      id
    }
  }
`;

const UPDATE_DATA = gql`
  mutation UpdateClient(
    $id: Int!
    $media_id: Int!
    $segment_id: Int!
    $title: String!
    $available: Boolean = true
  ) {
    updateClient(
      data: {
        id: $id
        media_id: $media_id
        segment_id: $segment_id
        title: $title
        available: $available
      }
    ) {
      id
    }
  }
`;

const DELETE_DATA = gql`
  mutation RemoveClient($id: Int!) {
    removeClient(id: $id) {
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