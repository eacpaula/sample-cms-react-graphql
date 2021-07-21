import { gql } from '@apollo/client'

const ADD_DATA = gql`
  mutation AddSubject(
    $title: String!
    $emails: String!
    $available: Boolean = true
  ) {
    addSubject(
      data: {
        title: $title
        emails: $emails
        available: $available
      }
    ) {
      id
    }
  }
`;

const UPDATE_DATA = gql`
  mutation UpdateSubject(
    $id: Int!
    $title: String!
    $emails: String!
    $available: Boolean = true
  ) {
    updateSubject(
      data: {
        id: $id
        title: $title
        emails: $emails
        available: $available
      }
    ) {
      id
    }
  }
`;

const DELETE_DATA = gql`
  mutation RemoveSubject($id: Int!) {
    removeSubject(id: $id) {
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