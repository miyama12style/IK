import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { handleSetItemText } from "src/method";
import { Data, WineItem } from "src/types";
import { filterRankLists, filterTypeLists, wineItemLists } from "src/utils";

type Props = {
  items: Data;
};

export const ItemLists: React.FC<Props> = (props) => {
  const router = useRouter();
  const data = useMemo(() => props.items, []);
  const [onPatch, setOnPatch] = useState(false);
  const [wineItems, setWineItems] = useState(wineItemLists(data));
  const [initWineItems, setInitWineItems] = useState<WineItem>([]);

  useEffect(() => {
    setInitWineItems(wineItems);
  }, []);

  const handleChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLInputElement>,
      index: number
    ) => {
      setWineItems((items) =>
        items.map((item, i) =>
          i === index ? { title: item.title, titleData: e.target.value } : item
        )
      );
    },
    [wineItems]
  );

  const handleSetItem = useCallback(
    (id: string) => {
      const initPostData = wineItems.filter((item, index) => {
        return item.titleData !== initWineItems[index].titleData;
      });

      const filterPostData = initPostData.filter(
        ({ title }) => title === "種類:" || title === "ランク:"
      );

      const filterTypeAndRank = filterPostData.some((data, i) =>
        data.title === "種類:"
          ? data.titleData === filterTypeLists[i]
          : data.title === "ランク:"
          ? data.titleData === filterRankLists[i]
          : undefined
      );

      console.log(filterTypeAndRank);

      if (initPostData.length === 0) {
        setOnPatch(false);
      }
      if (!filterTypeAndRank && filterPostData.length !== 0) {
        filterPostData.map((data) => {
          if (data.title === "種類:") {
            toast.error(
              'ワインの種類は\n"red","white","rose","spark"\nのどれかを入力してください'
            );
          } else if (data.title === "ランク:") {
            toast.error(
              'ワインのランクは\n"oneRank","twoRank","another"\nのどれかを入力してください'
            );
          }
        });
      } else {
        handleSetItemText(JSON.stringify(initPostData), id);
      }
    },
    [wineItems]
  );

  return (
    <dl className="sm: flex flex-wrap justify-around p-7 w-1/2 text-gray-700 font-mono tracking-wide bg-yellow-50 rounded-lg sm:mt-4 sm:w-11/12">
      {wineItems.map((item, index) =>
        item.titleData || item.titleData === "" ? (
          <React.Fragment key={item.title}>
            <dt className="mt-2 w-1/4 font-bold leading-loose">{item.title}</dt>
            {!onPatch ? (
              <dd className="mt-2 w-3/4 leading-loose sm:w-2/3">
                {item.titleData}
              </dd>
            ) : item.title !== "備考:" ? (
              <input
                className="mt-2 border rounded-md"
                value={item.titleData}
                onChange={(e) => handleChange(e, index)}
              />
            ) : (
              <textarea
                className="mt-2 border rounded-md"
                wrap="soft"
                value={item.titleData}
                onChange={(e) => handleChange(e, index)}
              />
            )}
          </React.Fragment>
        ) : null
      )}
      {router.pathname.indexOf("order") === -1 ? (
        <div className="mt-6 w-full">
          <div className="flex flex-auto items-center mt-7">
            <p className="w-1/2 text-gray-500">項目の編集</p>
            <button
              className="py-2 w-1/3 font-mono bg-blue-200 rounded-lg"
              onClick={() => setOnPatch(true)}
            >
              編集
            </button>
            <button
              className="ml-3 py-2 w-1/3 font-mono bg-yellow-300 rounded-lg"
              onClick={() => handleSetItem(data.id)}
            >
              完了
            </button>
          </div>
        </div>
      ) : null}
    </dl>
  );
};
