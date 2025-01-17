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
      <Form action={handleClick}>
        <div>
          <input
            name="search"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Enter Name"
            className="m-5 p-2 text-slate-800"
            value={search}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          >
            Search
          </button>
        </div>
      </Form>

      {loading ? (
        <div>Loading....</div>
      ) : (
        <table className={"table-auto w-full"}>
          <thead>
            <tr>
              <td className={"w-auto p-2"}>Player Name</td>
              <td className={"w-auto p-2"}>EVP Rating</td>
              <td className={"w-auto p-2"}>PPD</td>
              <td className={"w-auto p-2"}>MPR</td>
            </tr>
          </thead>
          <tbody>
            {data?.map((player: IPlayer, index) => {
              return (
                <tr key={index}>
                  <td className={"w-auto p-2"}>{player.name}</td>
                  <td className={"w-auto p-2"}>{player.evpRating}</td>
                  <td className={"w-auto p-2"}>{player.ppd}</td>
                  <td className={"w-auto p-2"}>{player.mpr}</td>
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
