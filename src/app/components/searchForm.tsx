"use client";
import { useState } from "react";
import Form from "next/form";
import { IPlayer } from "../lib/IPlayer";

export const SearchForm = () => {
  const [data, setData] = useState<IPlayer[]>();
  const [name, setName] = useState("");
  const [minEvp, setMinEvp] = useState("");
  const [maxEvp, setMaxEvp] = useState("");
  const [loading, setLoading] = useState(false);

  const searchAction = async () => {
    console.log("!!! searchAction");
    if (!loading) {
      setData([]);
      setLoading(true);
      if (
        (name && name.length > 0) ||
        (minEvp && minEvp.length > 0) ||
        (maxEvp && maxEvp.length > 0)
      ) {
        const url = `/api/search?name=${encodeURIComponent(name)}&min=${encodeURIComponent(minEvp)}&max=${encodeURIComponent(maxEvp)}`;
        console.log("!!! url: ", url);
        const response = await fetch(url);
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

  const handleMin = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    const regex = /^[0-9]*\.?[0-9]*$/;

    if (regex.test(inputValue)) {
      setMinEvp(inputValue);
    }
  };

  const handleMax = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    const regex = /^[0-9]*\.?[0-9]*$/;

    if (regex.test(inputValue)) {
      setMaxEvp(inputValue);
    }
  };

  return (
    <div className={"w-full"}>
      <h1 className="mx-5">EDC Remote Stat Search</h1>
      <Form action={handleClick}>
        <div>
          <div className="mt-3 w-full">
            <input
              name="name"
              autoFocus
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
              className="mx-5 px-3 text-slate-800 focus:outline-none"
              value={name}
              tabIndex={0}
            />
          </div>
          <div className="mt-3 w-full">
            <input
              name="minEvp"
              onChange={handleMin}
              placeholder="Enter Minimum Evp Rating"
              className="mx-5 px-3 text-slate-800 focus:outline-none"
              value={minEvp}
              tabIndex={0}
            />
          </div>
          <div className="mt-3 w-full">
            <input
              name="maxEvp"
              onChange={handleMax}
              placeholder="Enter Max Evp Rating"
              className="mx-5 px-3 text-slate-800 focus:outline-none"
              value={maxEvp}
              tabIndex={0}
            />
          </div>
          <div className="mt-3 w-full">
            <button
              type="submit"
              className="mx-5 w-56 bg-purple-500 hover:bg-purple-700 text-white font-bold px-2 border-purple-900 outline-none rounded"
            >
              Search
            </button>
          </div>
        </div>
      </Form>

      {loading ? (
        <div className="mx-5 my-5">Loading....</div>
      ) : (
        <div className="inline-block rounded-lg border shadow-2xl my-5 mx-5">
          <table className={"table-auto w-full"}>
            <thead className="bg-gradient-to-r from-purple-900 to-pink-400 text-white outline outline-1 outline-purple-900 overflow-hidden">
              <tr className="font-bold">
                <th className={"w-auto text-left"}>Player Name</th>
                <th className={"w-auto text-left "}>EVP Rating</th>
                <th className={"w-auto text-left"}>PPD</th>
                <th className={"w-auto text-left"}>MPR</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((player: IPlayer, index) => {
                return (
                  <tr
                    key={index}
                    className="even:bg-purple-200 odd:bg-gray-100 even:text-white-900 dark:text-gray-900 "
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
        </div>
      )}
    </div>
  );
};

export default SearchForm;
