import { getALLRooms } from "@/lib/actions/room.action";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const room = await getALLRooms();

    return NextResponse.json({
      room,
    });
  } catch (error) {
    return NextResponse.json({
      error: "Error is coming from req.json in api/GetAllRoom/route.ts",
    });
  }
}
