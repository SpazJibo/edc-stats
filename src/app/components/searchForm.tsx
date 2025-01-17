"use client";
import { useState } from "react";
import Form from "next/form";
import { IPlayer } from "../lib/IPlayer";

export const SearchForm = () => {
  const [data, setData] = useState<IPlayer[]>();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const searchAction = async () => {
    if (!loading) {
      setData([]);
      setLoading(true);
      if (search && search.length > 0) {
        const response = await fetch(
          `/api/search?query=${encodeURIComponent(search)}`,
        );
        console.log("!!! before Request");
        const data = await response.json();
        console.log("!!! after Request");
        setData(data);
      }
      setLoading(false);
    }
  };

  const handleClick = () => {
    setLoading(true);
    searchAction();
  };

  return (
    <div className={"w-full"}>
      <h1 className="mx-5">EDC Remote Stat Search</h1>
      <Form action={handleClick}>
        <div>
          <input
            name="search"
            autoFocus
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter Name"
            className="mx-5 px-3 text-slate-800 focus:outline-none"
            value={search}
            tabIndex={0}
          />
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold px-2 border-purple-900 outline-none rounded"
          >
            Search
          </button>
        </div>
      </Form>

      {loading ? (
        <div className="mx-5 my-5">Loading....</div>
      ) : (
        <table
          className={"table-auto w-full mx-3 my-5 border-gray-600 border-2"}
        >
          <thead className="bg-gradient-to-r from-purple-900 to-pink-400 text-white">
            <tr className="font-bold">
              <td className={"w-auto p-3"}>Player Name</td>
              <td className={"w-auto p-3"}>EVP Rating</td>
              <td className={"w-auto p-3"}>PPD</td>
              <td className={"w-auto p-3"}>MPR</td>
            </tr>
          </thead>
          <tbody>
            {data?.map((player: IPlayer, index) => {
              return (
                <tr
                  key={index}
                  className="even:bg-purple-200 odd:bg-gray-100 even:text-white-900 dark:text-gray-900"
                >
                  <td className={"w-auto text-sm text-left p-2"}>
                    {player.name}
                  </td>
                  <td className={"w-auto text-sm text-left p-2"}>
                    {player.evpRating.toFixed(2)}
                  </td>
                  <td className={"w-auto text-sm text-left p-2"}>
                    {player.ppd.toFixed(2)}
                  </td>
                  <td className={"w-auto text-sm text-left p-2"}>
                    {player.mpr.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SearchForm;
