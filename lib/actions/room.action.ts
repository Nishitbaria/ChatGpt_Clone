import Room from "@/database/room.model";
import { connectToDatabase } from "../mongoose";
import { Schema } from "mongoose";
import ChatMessage from "@/database/chat.model";

export async function getALLRooms() {
  try {
    connectToDatabase();

    const rooms = await Room.find({}, { _id: 1, name: 1 });
    if (!rooms) {
      throw new Error("No rooms found");
    }
    return rooms;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// interface CreateRoomParams {
//   name: string;
//   messages: Schema.Types.ObjectId[];
// }

export async function createRoom() {
  try {
    connectToDatabase();

    const len = (await Room.find({})).length;

    const defaultRoom = {
      name: `Room ${len + 1}`,
      messages: [],
    };

    const chat = await Room.create(defaultRoom);

    return chat;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getRoombyId(params: any) {
  try {
    connectToDatabase();

    const { id } = params;

    const room = await Room.findById({ id });

    if (!room) {
      throw new Error("Room not found");
    }

    return room;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteRoomMessages(params: any) {
  try {
    connectToDatabase();

    const id = params;

    // Find the room by ID
    const room = await Room.findById(id);

    if (!room) {
      throw new Error("Room not found");
    }

    // Delete messages associated with the room (assuming messages are stored as separate documents)
    await ChatMessage.deleteMany({ _id: { $in: room.messages } });

    // Clear the messages array in the room
    room.messages = [];

    // Save the updated room
    await room.save();

    return "delete success";
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete room messages");
  }
}
