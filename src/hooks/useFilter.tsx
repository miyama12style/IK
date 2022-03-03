import { useState } from "react";
import toast from "react-hot-toast";
import { Data } from "src/types";

export const useFilter = (contents: Data[]) => {
  const [originFilterQuery, setOriginFilterQuery] = useState("");
  const [varietyFilterQuery, setVarietyFilterQuery] = useState("");
  const [tasteFilterQuery, setTasteFilterQuery] = useState("");
  const [data, setData] = useState(contents);

  const prices = [
    { id: 1, price: "〜なし〜" },
    { id: 2, price: "3000~3999" },
    { id: 3, price: "4000~4999" },
    { id: 4, price: "5000~5999" },
    { id: 5, price: "6000~6999" },
    { id: 6, price: "7000~" },
  ];

  const filterContents = () => {
    if (
      !originFilterQuery.match("[^\x01-\x7E]") &&
      !varietyFilterQuery.match("[^\x01-\x7E]") &&
      !tasteFilterQuery.match("[^\x01-\x7E]")
    ) {
      toast.error("ひらがな、または漢字で検索欄に入力してください。");
    } else if (
      originFilterQuery === "" &&
      varietyFilterQuery === "" &&
      tasteFilterQuery === ""
    ) {
      toast.error("検索欄が空欄です。");
    } else {
      const originFilterData = data.filter((data) => {
        return data.origin === originFilterQuery;
      });

      const isOriginData =
        originFilterData.length === 0 ? data : originFilterData;

      const varietyFilterData = isOriginData.filter((data) => {
        return data.variety === varietyFilterQuery;
      });

      const isVarietyData =
        varietyFilterData.length === 0 ? isOriginData : varietyFilterData;

      const tasteFilterData = isVarietyData.filter((data) => {
        return data.taste
          .replace("、", "")
          .includes(tasteFilterQuery.replace("、", ""));
      });

      const filterData =
        tasteFilterData.length === 0 ? isVarietyData : tasteFilterData;

      {
        filterData.length === 0
          ? toast.error("検索に一致するワインが見つかりませんでした。")
          : setData(filterData);
      }
    }
  };

  const handlePriceFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const priceFilterContents = contents.filter(({ price }) => {
      for (let i: number = prices.length; i > 0; i--) {
        if (
          i === prices.length &&
          e.target.value === prices.length.toString() &&
          price >= (i + 1) * 1000
        ) {
          return true;
        }
        if (
          i > 1 &&
          i < prices.length &&
          e.target.value === i.toString() &&
          (i + 1) * 1000 + 999 >= price &&
          price >= (i + 1) * 1000
        ) {
          return true;
        }
        if (i === 1 && e.target.value === i.toString()) {
          return true;
        }
      }
    });

    if (priceFilterContents.length === 0) {
      toast.error(
        `${prices[parseInt(e.target.value) - 1].price}円のワインはありません。`
      );
      e.target.value = "1";
      setData(contents);
    } else {
      setData(priceFilterContents);
    }
  };

  const textLists = [
    {
      title: "産地: ",
      placeholder: "例）ブルゴーニュ",
      value: originFilterQuery,
      onChange: setOriginFilterQuery,
    },
    {
      title: "品種: ",
      placeholder: "例）シャルドネ",
      value: varietyFilterQuery,
      onChange: setVarietyFilterQuery,
    },
    {
      title: "味わい: ",
      placeholder: "例）フルーティ",
      value: tasteFilterQuery,
      onChange: setTasteFilterQuery,
    },
  ];

  const handleReset = () => {
    setData(contents);
    setOriginFilterQuery("");
    setVarietyFilterQuery("");
    setTasteFilterQuery("");
  };

  return {
    data,
    textLists,
    prices,
    handlePriceFilter,
    filterContents,
    handleReset,
  };
};