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
  const search = searchParams?.get("query")?.toLowerCase();
  if (search && search !== "") {
    const foundPlayers = playerData.filter((player) =>
      player.name.toLowerCase().includes(search),
    );

    if (foundPlayers && foundPlayers.length > 0) {
      return NextResponse.json(foundPlayers);
    } else {
      return NextResponse.json([]);
    }
  }
}
