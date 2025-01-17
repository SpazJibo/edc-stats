"use server";
import { IPlayer } from "../lib/IPlayer";
import { JSDOM } from "jsdom";

const playerData: IPlayer[] = [];
let creationDate = Date.now();

export const setPlayerData = async (data: string): Promise<IPlayer[]> => {
  console.log("!!! playerData in setPlayerData: ", playerData.length);
  const edcDocument = new JSDOM(data);
  const doc = edcDocument.window.document;

  const firstTable = doc.querySelector("table");
  if (firstTable) {
    const rows = Array.from(firstTable.querySelectorAll("tbody tr"));

    const cells = rows.map((row) => {
      const returnedTd = Array.from(row.querySelectorAll("td"));
      return returnedTd.map((cell) => cell?.textContent?.trim());
    });

    const isValid = (value: string): boolean => {
      if (typeof value != "string") return false;
      return !isNaN(Number(value));
    };

    const playerResults: IPlayer[] = [];
    cells.map((subArray) => {
      if (subArray && subArray.length > 0 && subArray[0]) {
        playerResults.push({
          name: subArray[0],
          evpRating:
            subArray[1] && isValid(subArray[1])
              ? Number.parseFloat(subArray[1])
              : 0,
          games:
            subArray[2] && isValid(subArray[2])
              ? Number.parseFloat(subArray[2])
              : 0,
          wins:
            subArray[3] && isValid(subArray[3])
              ? Number.parseFloat(subArray[3])
              : 0,
          ppd:
            subArray[4] && isValid(subArray[4])
              ? Number.parseFloat(subArray[4])
              : 0,
          mpr:
            subArray[5] && isValid(subArray[5])
              ? Number.parseFloat(subArray[5])
              : 0,
        });
      }
    });

    playerData.push(...playerResults);
    creationDate = Date.now();
    return playerData;
  }
  return [];
};

export const getPlayerData = async (): Promise<IPlayer[]> => {
  console.log("!!! playerData in getData", playerData.length);
  const d = new Date();
  if (creationDate >= d.setHours(d.getHours() - 2)) {
    return playerData;
  } else {
    return [];
  }
};
