import { gql } from '@apollo/client'

const ADD_DATA = gql`
  mutation AddNews(
    $media_id: Int!
    $title: String!
    $description: String!
    $content: String!
    $available: Boolean = true
    $highlight: Boolean = true
    $publishDate: DateTime!
    $expireDate: DateTime!
  ) {
    addNews(
      data: {
        media_id: $media_id
        title: $title
        description: $description
        content: $content
        available: $available
        highlight: $highlight
        publishDate: $publishDate
        expireDate: $expireDate
      }
    ) {
      id
    }
  }
`;

const UPDATE_DATA = gql`
  mutation UpdateNews(
    $id: Int!
    $media_id: Int!
    $title: String!
    $description: String!
    $content: String!
    $available: Boolean = true
    $highlight: Boolean = true
    $publishDate: DateTime!
    $expireDate: DateTime!
  ) {
    updateNews(
      data: {
        id: $id
        media_id: $media_id
        title: $title
        description: $description
        content: $content
        available: $available
        highlight: $highlight
        publishDate: $publishDate
        expireDate: $expireDate
      }
    ) {
      id
    }
  }
`;

const DELETE_DATA = gql`
  mutation RemoveNews($id: Int!) {
    removeNews(id: $id) {
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