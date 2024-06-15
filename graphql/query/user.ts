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
    }
  }
`);
