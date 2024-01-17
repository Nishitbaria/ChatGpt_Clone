// import Room from "@/database/room.model";
import Room from "@/database/room.model";
import { connectToDatabase } from "../mongoose";
import ChatMessage from "@/database/chat.model";
import { createRoom } from "./room.action";

export async function getChat(params: any) {
  try {
    connectToDatabase();

    const id = params;

    if (!id) {
      throw new Error("No room id provided");
    }

    const message = await ChatMessage.find({ room: id })
      .sort({
        createdAt: -1,
      })
      .populate("room");

    if (!message) {
      throw new Error("No message found");
    }

    return message;
  } catch (error) {
    console.log(error);
  }
}

export async function createChat(
  question: string,
  answer: string,
  roomId: string
) {
  try {
    connectToDatabase();

    let newroom;

    if (!roomId) {
      newroom = await createRoom();
      roomId = newroom._id;
    }

    if (!question && !answer)
      throw new Error("No question and answer provided...!");

    /** specify data to the message model */
    const message = await ChatMessage.create({
      question,
      answer,
      room: roomId,
    });

    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      {
        $push: { messages: message._id },
      },
      { new: true }
    );

    if (!message) {
      throw new Error("No message found");
    }

    return message;
  } catch (error) {
    console.log(error);
  }
}
