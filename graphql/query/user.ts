import { graphql } from "../../gql";

export const verifyGoogleUserTokenQuery = graphql(`#graphql
query verifyGoogleUserToken($token:String!){
    verifyGoogleToken(token: $token)
}

`);
