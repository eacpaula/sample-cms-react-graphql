import { gql } from '@apollo/client'

const ADD_DATA = gql`
  mutation AddArea(
    $title: String!
    $emails: String!
    $available: Boolean = true
  ) {
    addArea(
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
  mutation UpdateArea(
    $id: Int!
    $title: String!
    $emails: String!
    $available: Boolean = true
  ) {
    updateArea(
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
  mutation RemoveArea($id: Int!) {
    removeArea(id: $id) {
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