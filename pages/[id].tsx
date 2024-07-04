import TwitterLayout from "@/components/Feed/Layout/TwitterLayout";
import { useRouter } from "next/router";
import { GetServerSideProps, NextPage } from "next";
import { RxArrowLeft } from "react-icons/rx";
import Image from "next/image";
import { useCurrentUser } from "@/hooks/user";
import Feed from "@/components/Feed";
import { Tweet, User } from "@/gql/graphql";
import { graphqlClient } from "@/client/api";
import { getUserByIdQuery } from "@/graphql/query/user";
import Link from "next/link";
import { useCallback, useMemo } from "react";
import {
  followUserMutation,
  unfollowUserMutation,
} from "@/graphql/mutation/user";
import { useQueryClient } from "@tanstack/react-query";

interface ServerProps {
  userInfo: User;
}

const UserProfile: NextPage<ServerProps> = (props) => {
  const router = useRouter();
  const { user: currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const amIFollowing = useMemo(() => {
    if (!props.userInfo) return false;
    return (
      (currentUser?.following?.findIndex(
        (el) => el?.id === props.userInfo.id
      ) ?? -1) >= 0
    );
  }, [currentUser?.following, props.userInfo]);

  const handleFollowUser = useCallback(async () => {
    if (!props.userInfo?.id) return;
    await graphqlClient.request(followUserMutation, { to: props.userInfo?.id });
    await queryClient.invalidateQueries({ queryKey: ["current-user"] });
  }, [props.userInfo?.id, queryClient]);

  const handleUnFollowUser = useCallback(async () => {
    if (!props.userInfo?.id) return;
    await graphqlClient.request(unfollowUserMutation, {
      to: props.userInfo?.id,
    });
    await queryClient.invalidateQueries({ queryKey: ["current-user"] });
  }, [props.userInfo?.id, queryClient]);

  return (
    <div>
      <TwitterLayout>
        <div>
          <nav className=" flex items-center gap-5 py-3 px-3">
            <Link href="/">
              <RxArrowLeft className="text-4xl rounded-full hover:bg-slate-600 " />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">
                {props.userInfo?.firstName} {props.userInfo?.lastName}
              </h1>
              <h1 className="text-md font-bold text-slate-400">
                {props.userInfo?.tweets?.length} tweets
              </h1>
            </div>
          </nav>
          <div className=" p-4 border-b border-slate-800">
            {props.userInfo?.profileImageURL && (
              <Image
                className="rounded-full"
                src={props.userInfo?.profileImageURL}
                alt="profile"
                height={150}
                width={150}
              />
            )}
            <h1 className="text-2xl font-bold mt-5">
              {props.userInfo?.firstName} {props.userInfo?.lastName}
            </h1>
            <div className="flex justify-between items-center">
              <div className="flex mt-2 gap-2 text-gray-400">
                <span>{props.userInfo?.followers?.length} followers</span>
                <span>{props.userInfo?.following?.length} following</span>
              </div>
              {currentUser?.id !== props.userInfo?.id && (
                <>
                  {amIFollowing ? (
                    <button
                      onClick={handleUnFollowUser}
                      className="bg-white px-5 py-[7px] text-sm rounded-full text-black"
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      onClick={handleFollowUser}
                      className="bg-white px-5 py-[7px] text-sm rounded-full text-black"
                    >
                      Follow
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <div>
            {props.userInfo?.tweets?.map((tweet) => (
              <Feed data={tweet as Tweet} key={tweet?.id} />
            ))}
          </div>
        </div>
      </TwitterLayout>
    </div>
  );
};
export const getServerSideProps: GetServerSideProps<ServerProps> = async (
  context
) => {
  const id = context.query.id as string | undefined;
  if (!id) return { notFound: true, props: { userInfo: undefined } };
  const userInfo = await graphqlClient.request(getUserByIdQuery, { id });
  if (!userInfo.getUserById) return { notFound: true };
  return {
    props: {
      userInfo: userInfo.getUserById as User,
    },
  };
};

export default UserProfile;
