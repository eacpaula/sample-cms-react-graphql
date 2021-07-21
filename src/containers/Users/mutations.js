import { gql } from '@apollo/client'

const ADD_DATA = gql`
  mutation AddUser(
    $username: String!
    $password: String!
  ) {
    addUser(
      data: {
        username: $username
        password: $password
      }
    ) {
      id
    }
  }
`;

const CHANGE_PASSWORD = gql`
  mutation changePassword(
    $username: String!
    $password_old: String!
    $password: String!
    $password_confirmation: String!
  ) {
    changePassword(
      data: {
        username: $username
        password_old: $password_old
        password: $password
        password_confirmation: $password_confirmation
      }
    ) {
      id
    }
  }
`;

const DELETE_DATA = gql`
  mutation RemoveUser($id: Int!) {
    removeUser(id: $id) {
      id
    }
  }
`;

const mutations = {
    ADD_DATA,
    CHANGE_PASSWORD,
    DELETE_DATA
}

export default mutations