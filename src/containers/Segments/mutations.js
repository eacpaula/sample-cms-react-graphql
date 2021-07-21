import { gql } from '@apollo/client'

const ADD_DATA = gql`
  mutation AddSegment(
    $title: String!
    $available: Boolean = true
  ) {
    addSegment(
      data: {
        title: $title
        available: $available
      }
    ) {
      id
    }
  }
`;

const UPDATE_DATA = gql`
  mutation UpdateSegment(
    $id: Int!
    $title: String!
    $available: Boolean = true
  ) {
    updateSegment(
      data: {
        id: $id
        title: $title
        available: $available
      }
    ) {
      id
    }
  }
`;

const DELETE_DATA = gql`
  mutation RemoveSegment($id: Int!) {
    removeSegment(id: $id) {
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