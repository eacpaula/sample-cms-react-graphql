import { gql } from '@apollo/client'

const DELETE_DATA = gql`
  mutation RemoveContact($id: Int!) {
    removeContact(id: $id) {
      id
    }
  }
`;

const mutations = {
    DELETE_DATA
}

export default mutations