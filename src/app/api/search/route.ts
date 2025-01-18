import { NextResponse } from "next/server";
import { getPlayerData, setPlayerData } from "@/app/actions/playerData";
import { IPlayer } from "../../lib/IPlayer";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const getData = async (): Promise<IPlayer[]> => {
    const playerData = await getPlayerData();

    console.log("!!! playerData: ", playerData.length);
    if (playerData && playerData.length > 0) {
      return playerData;
    } else {
      const edcData = await fetch(
        "https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vQUFyJVPm5vsleNgWMFGW7vt15u_UBmrpIvNC6IMNjdRdHeaBFZkm9WeZcGOeQ0YwWHocL11T2-zT1L/pubhtml#",
        {
          cache: "force-cache",
          next: {
            revalidate: 3600,
          },
        },
      );

      let response = "";

      response = await edcData.text();
      const newPlayerData = await setPlayerData(response);

      return newPlayerData;
    }
  };

  const playerData = await getData();
  const name = searchParams?.get("name")?.toLowerCase();
  const maxQuery = searchParams?.get("max");
  const max = maxQuery ? Number.parseFloat(maxQuery) : null;
  const minQuery = searchParams?.get("min");
  console.log("!!! minQuery: ", minQuery);
  const min = minQuery ? Number.parseFloat(minQuery) : null;

  const foundPlayers: IPlayer[] = [];

  console.log("!!! playerData.length: ", playerData.length);
  console.log("!!! name: ", name);
  console.log("!!! min: ", min);
  console.log("!!! max: ", max);

  if (name && name !== "") {
    playerData
      .filter((player) => player.name.toLowerCase().includes(name))
      .map((player) => foundPlayers.push(player));
  } else {
    console.log("!!! else");
    console.log("!!! playerData: ", playerData.length);
    foundPlayers.concat(playerData);
  }

  console.log("!!! foundPlayers before max & min: ", foundPlayers.length);
  if (max && min) {
    console.log(
      "!!! max && min playersData: ",
      playerData.length,
      " foundPlaysers: ",
      foundPlayers.length,
    );
    const evpPlayers =
      foundPlayers.length > 0
        ? foundPlayers.filter((player) => {
            return player.evpRating <= max && player.evpRating >= min;
          })
        : playerData.filter((player) => {
            return player.evpRating <= max && player.evpRating >= min;
          });

    console.log("!!! evpPlayers in min && max: ", evpPlayers);
    if (evpPlayers && evpPlayers.length > 0) {
      return NextResponse.json(evpPlayers);
    } else {
      return NextResponse.json([]);
    }
  }

  if (min) {
    const evpPlayers =
      foundPlayers.length > 0
        ? foundPlayers.filter((player) => {
            return player.evpRating >= min;
          })
        : playerData.filter((player) => {
            return player.evpRating >= min;
          });
    if (evpPlayers && evpPlayers.length > 0) {
      return NextResponse.json(evpPlayers);
    } else {
      return NextResponse.json([]);
    }
  }

  if (max) {
    const evpPlayers =
      foundPlayers.length > 0
        ? foundPlayers.filter((player) => {
            return player.evpRating <= max;
          })
        : playerData.filter((player) => {
            return player.evpRating <= max;
          });
    if (evpPlayers && evpPlayers.length > 0) {
      return NextResponse.json(evpPlayers);
    } else {
      return NextResponse.json([]);
    }
  }
  // Default Return
  return NextResponse.json(foundPlayers);
}
