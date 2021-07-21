import { gql } from '@apollo/client'

const DELETE_DATA = gql`
  mutation RemoveWorkWithUs($id: Int!) {
    removeWorkWithUs(id: $id) {
      id
    }
  }
`;

const mutations = {
    DELETE_DATA
}

export default mutations