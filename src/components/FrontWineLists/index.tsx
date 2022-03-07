import { Data, Props } from "src/types";
import { handleDelete, handleOnOrder } from "src/method";
import { HandleCountButton } from "../HandleCountButton";
import { ItemLists } from "../ItemLists";
import { FilterComponents } from "../FilterComponents";
import { useFilter } from "src/hooks/useFilter";

export const FrontWineLists: React.FC<Props> = (props) => {
  const contents = props.contents;
  const { data, textLists, filterContents, handlePriceFilter, handleReset } =
    useFilter(contents);

  const rankData = data?.filter(
    (data: Data) =>
      data.rank[0] === props.keyRank && data.type[0] === props.keyType
  );

  if (rankData.length === 0) {
    return (
      <p className="flex items-center justify-center h-screen text-gray-700 font-mono text-4xl sm:text-2xl">
        登録しているワインがありません!
      </p>
    );
  }

  return (
    <div className="h-screen">
      <FilterComponents
        textLists={textLists}
        filterContents={filterContents}
        handlePriceFilter={handlePriceFilter}
        handleReset={handleReset}
      />
      {rankData?.map((data: Data, index) => (
        <div
          className="flex items-center justify-around mx-auto my-5 w-11/12 h-2/5 bg-blue-100 rounded-lg shadow-lg sm:flex-wrap sm:py-8 sm:h-auto"
          key={data.id}
        >
          <div className="text-center">
            <img
              className="w-60 h-60 rounded-lg object-cover sm:mx-auto"
              src={data?.image ? data.image.url : "/images/ikgroup-wineimage.jpg"}
              alt="ワインの画像です"
            />
            <button
              className="mt-5 mx-3 py-2 w-1/3 font-mono bg-yellow-100 rounded-lg"
              onClick={() =>
                handleDelete(
                  data.id,
                  data.frontBottleCount
                )
              }
            >
              削除
            </button>
            <div className="flex mt-5 font-mono">
              <p>表にある本数:</p>
              <p className="ml-5">{data.frontBottleCount}</p>
            </div>
            <HandleCountButton
              rankData={rankData}
              index={index}
              id={data.id}
              text="発注本数"
              handlePost={handleOnOrder}
            />
          </div>
          <ItemLists items={data} />
        </div>
      ))}
    </div>
  );
};
