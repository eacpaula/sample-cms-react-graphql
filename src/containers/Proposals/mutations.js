import { gql } from '@apollo/client'

const DELETE_DATA = gql`
  mutation RemoveBanner($id: Int!) {
    removeBanner(id: $id) {
      id
    }
  }
`;

const mutations = {
    DELETE_DATA
}

export default mutations