import {
  createRoom,
  deleteRoomMessages,
  getRoombyId,
} from "@/lib/actions/room.action";
// import { createChat } from "@/lib/actions/chat.action";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const room = await createRoom();

    return NextResponse.json({
      room,
    });
  } catch (error) {
    console.error("Error saving chat message:", error);
    return NextResponse.json({
      error: "Error is coming from req.json in api/CreatRoom/route.ts",
    });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const room = await getRoombyId(id);

    return NextResponse.json({
      name: room.name,
      messages: room.messages,
    });
  } catch (error) {
    return NextResponse.json({
      error: "Error is coming from req.json in api/saveMessage/route.ts",
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    await deleteRoomMessages(id);

    return NextResponse.json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({
      error: "Error is coming from req.json in api/saveMessage/route.ts",
    });
  }
}
