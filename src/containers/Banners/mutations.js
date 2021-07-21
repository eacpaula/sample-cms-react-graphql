import { gql } from '@apollo/client'

const ADD_DATA = gql`
  mutation AddBanner(
    $media_id: Int!
    $title: String!
    $description: String!
    $link: String!
    $available: Boolean = true
  ) {
    addBanner(
      data: {
        media_id: $media_id
        title: $title
        description: $description
        link: $link
        available: $available
      }
    ) {
      id
    }
  }
`;

const UPDATE_DATA = gql`
  mutation UpdateBanner(
    $id: Int!
    $media_id: Int!
    $title: String!
    $description: String!
    $link: String!
    $available: Boolean = true
  ) {
    updateBanner(
      data: {
        id: $id
        media_id: $media_id
        title: $title
        description: $description
        link: $link
        available: $available
      }
    ) {
      id
    }
  }
`;

const DELETE_DATA = gql`
  mutation RemoveBanner($id: Int!) {
    removeBanner(id: $id) {
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