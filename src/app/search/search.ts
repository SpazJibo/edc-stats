import { NextResponse } from "next/server";
import { JSDOM } from "jsdom";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams?.get("query");

  const edcData = await fetch(
    "https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vQUFyJVPm5vsleNgWMFGW7vt15u_UBmrpIvNC6IMNjdRdHeaBFZkm9WeZcGOeQ0YwWHocL11T2-zT1L/pubhtml#",
  );
  const response = await edcData.text();

  const edcDocument = new JSDOM(response);
  const doc = edcDocument.window.document;

  console.log("!!! edcData: ", doc.querySelector("table"));

  const rows = Array.from(doc.querySelectorAll("tbody tr"));

  const cells = rows.map((row) => {
    const cells = Array.from(row.querySelectorAll("td"));
    return cells.map((cell) => cell?.textContent?.trim());
  });

  if (search && search !== "") {
    const searchResults = cells.filter((subArray) => {
      if (subArray[0]) {
        subArray[0].toLowerCase().includes(search.toString().toLowerCase());
      } else {
        return false;
      }
    });
    if (searchResults) {
      console.log("!!! data: ", searchResults);
      return NextResponse.json(searchResults);
    }
  }
}
