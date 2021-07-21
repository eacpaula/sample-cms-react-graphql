import { gql } from '@apollo/client'

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

const mutations = {
    CHANGE_PASSWORD
}

export default mutations