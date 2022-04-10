import { FrontWineLists } from "src/pages/front/[type]/[rank]/frontWineLists";
import { client } from "src/libs/client";
import { CustomNextPage, GetStaticPaths, GetStaticProps } from "next";
import { PagesProps, Data } from "src/types";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "node:querystring";
import { backToTopLayout } from "src/layouts/backToTopLayout";

export type Params = ParsedUrlQuery & Pick<Data, "type" | "rank">;

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const data = await client.get({
    endpoint: "wine",
  });

  const paths = data.contents.map((data: Data) => ({
    params: { type: data.type[0], rank: data.rank[0] },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<
  PagesProps,
  { type: string; rank: string }
> = async ({ params }) => {
  if (!params) {
    return {
      notFound: true,
    };
  }

  const type = params.type;
  const rank = params.rank;

  const data = await client.get({
    endpoint: "wine",
    queries: {
      limit: 100,
    },
  });

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data,
      type,
      rank,
    },
    revalidate: 3,
  };
};

const Rank: CustomNextPage<PagesProps> = (props) => {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <p className="flex items-center justify-center h-screen text-gray-700 font-mono text-4xl">
        Loading...
      </p>
    );
  }

  const data = props.data.contents.filter(
    (data: Data) => data.frontBottleCount > 0
  );

  return (
    <FrontWineLists keyRank={props.rank} keyType={props.type} contents={data} />
  );
};

export default Rank;

Rank.getLayout = backToTopLayout;
