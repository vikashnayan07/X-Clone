import { graphql } from "../../gql";

export const verifyGoogleUserTokenQuery = graphql(`
  #graphql
  query VerifyGoogleUserToken($token: String!) {
    verifyGoogleToken(token: $token)
  }
`);
export const getCurrentuserQuery = graphql(`
  query GetCurrentUser {
    getCurrentUser {
      id
      profileImageURL
      email
      firstName
      lastName
      tweets {
        id
        content
        author {
          id
          firstName
          lastName
          profileImageURL
        }
      }
    }
  }
`);

export const getUserByIdQuery = graphql(`
  #graphql
  query GetuserById($id: ID!) {
    getUserById(id: $id) {
      id
      firstName
      lastName
      profileImageURL
      tweets {
        content
        id
        author {
          id
          firstName
          lastName
          profileImageURL
        }
      }
    }
  }
`);
