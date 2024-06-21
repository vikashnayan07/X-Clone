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

interface ServerProps {
  userInfo: User;
}

const UserProfile: NextPage<ServerProps> = (props) => {
  const router = useRouter();

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
            <h1 className="text-2xl font-bold mt-5">Vikash Nayan</h1>
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
