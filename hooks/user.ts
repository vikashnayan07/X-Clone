import { graphqlClient } from "@/client/api";
import { getCurrentuserQuery } from "@/graphql/query/user";
import { useQuery } from "@tanstack/react-query";

export const useCurrentUser = () => {
  const query = useQuery({
    queryKey: ["current-user"],
    queryFn: () => graphqlClient.request(getCurrentuserQuery),
  });
  return { ...query, user: query.data?.getCurrentUser };
};
