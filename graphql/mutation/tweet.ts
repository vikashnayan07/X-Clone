import { graphql } from "@/gql";

export const createTweetMutation = graphql(`
  #graphql
  mutation Mutation($payload: createTweetData!) {
    createTweet(payload: $payload) {
      id
    }
  }
`);
