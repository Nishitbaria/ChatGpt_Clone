"use client";

import { getChat } from "@/lib/actions/chat.action";
import axios from "axios";
import { set } from "mongoose";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "react-toastify";

interface Props {
  roomid?: any;
}

const Bubbles = ({ roomid }: Props) => {
  // const message = await getChat(roomid);
  const [messages, setMessages] = useState<
    { question: string; answer: string }[]
  >([]);

  const router = useRouter();

  const [inputText, setInputText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isCodeCopied, setIsCodeCopied] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string>(roomid);
  const [messageCount, setMessageCount] = useState<number>(0);

  const isCodeSnippet = (text: string): boolean => {
    return text.includes("```");
  };

  const formatMessage = (text: string): string => {
    return isCodeSnippet(text) ? text : `${text}`;
  };
  // @ts-ignore

  const renderMarkdown = (text: string): JSX.Element => {
    const isCode = isCodeSnippet(text);

    if (isCode) {
      // Extract code content from triple backticks
      const codeContent = text.replace(/```([\s\S]*?)```/, "$1");

      return (
        <SyntaxHighlighter
          language="javascript"
          showLineNumbers={true}
          style={atomDark}
        >
          {codeContent}
        </SyntaxHighlighter>
      );
    }
  };

  const saveMessageToMongoDB = async (message: {
    text: string;
    user: string;
  }): Promise<void> => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/createChat`,
        {
          question: message.text,
          answer: message.user,
          roomId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setRoomId(response.data.message.room);
      setMessageCount(messageCount + 1);
    } catch (error) {
      console.error("Error saving message to MongoDB:", error);
    }
  };

  // funcation for starting new chat

  const startNewChat = async () => {
    // Clear the chat history
    setMessages([]);

    // Clear the input
    setInputText("");

    try {
      // create rroom
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/createRoom`
      );
      if (response.data) {
        toast.success("Room created successfully");
        setRoomId(response.data.room?._id);
      }
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  const generateContent = async (): Promise<void> => {
    // Show user's message
    setMessages([]);
    const userMessage = { question: inputText, answer: "...." };

    // Show typing indicator
    setIsTyping(true);

    var text: any = "";
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`,
        {
          method: "POST",
          body: JSON.stringify({ question: inputText }),
        }
      );

      const aiAnswer = await response.json();

      // Convert plain text to HTML format

      const formattedAnswer = aiAnswer.reply.replace(/\n/g, "<br />");
      text = formattedAnswer;
      // Toast...
    } catch (error) {
      console.log(error);
    } finally {
    }

    saveMessageToMongoDB({
      text: inputText,
      user: formatMessage(text),
    });

    // Clear the input
    setInputText("");
    // Hide typing indicator
    setIsTyping(false);
  };

  const fetchChatMessages = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/createChat/?id=${roomId}`
      );
      if (res.data) {
        setMessages(res.data.message);

        if (res.data.message[0].room.messages.length <= 1) {
          router.push(`/chat/${roomId}`);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, [messageCount]);

  // use for typing indicator

  useEffect(() => {
    // If the AI is typing, simulate a delay before receiving the response
    if (isTyping) {
      const typingTimeout = setTimeout(() => {
        // Show a simulated AI response
        setMessages((prevMessages) => [
          ...prevMessages,
          { question: inputText, answer: "thinking...." },
        ]);
      }, 500); // Simulated delay in milliseconds

      // Clear the timeout when the component is unmounted or when the AI responds
      return () => clearTimeout(typingTimeout);
    }
  }, [isTyping]);

  return (
    <div>
      {/* Prompt Messages Container - Modify the height according to your need */}
      <div className="flex h-[97vh] w-[1200px] flex-col">
        {/* Prompt Messages */}
        <div className="flex-1 space-y-6 overflow-y-auto rounded-xl bg-gray-900 p-4 text-sm leading-6 text-slate-900 shadow-sm  dark:text-slate-300 sm:text-base sm:leading-7">
          {messages &&
            messages?.map((msg: any) => (
              <div key={msg?.id}>
                <div className="flex flex-row px-4 py-8 sm:px-6">
                  <img
                    className="mr-2 flex h-8 w-8 rounded-full sm:mr-4"
                    src="https://dummyimage.com/256x256/363536/ffffff&text=U"
                  />

                  <div className="flex max-w-3xl items-center">
                    <p>{msg?.question}</p>
                  </div>
                </div>

                {/* answer container */}
                <div className="flex bg-slate-100 px-4 py-8 dark:bg-slate-900 sm:px-6">
                  <img
                    className="mr-2 flex h-8 w-8 rounded-full sm:mr-4"
                    src="https://dummyimage.com/256x256/354ea1/ffffff&text=G"
                  />

                  <div className="flex w-full flex-col items-start lg:flex-row lg:justify-between">
                    <p className="max-w-3xl">{msg?.answer}</p>

                    <div className="mt-4 flex flex-row justify-start gap-x-2 text-slate-500 lg:mt-0">
                      <button className="hover:text-blue-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          stroke="currentColor"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                          ></path>
                          <path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3"></path>
                        </svg>
                      </button>
                      <button className="hover:text-blue-600" type="button">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          stroke="currentColor"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                          ></path>
                          <path d="M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3"></path>
                        </svg>
                      </button>
                      <button className="hover:text-blue-600" type="button">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          stroke="currentColor"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                          ></path>
                          <path d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"></path>
                          <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {/* Prompt message input */}
        <form
          className="mt-2"
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            generateContent();
          }}
        >
          <label htmlFor="chat-input" className="sr-only">
            Enter your prompt
          </label>
          <div className="relative">
            <button
              type="button"
              className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-600"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M9 2m0 3a3 3 0 0 1 3 -3h0a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3h0a3 3 0 0 1 -3 -3z"></path>
                <path d="M5 10a7 7 0 0 0 14 0"></path>
                <path d="M8 21l8 0"></path>
                <path d="M12 17l0 4"></path>
              </svg>
              <span className="sr-only">Use voice input</span>
            </button>
            <footer className="sticky bottom-0 z-10 bg-white border-t border-gray-200 pt-2 pb-3 sm:pt-4 sm:pb-6 dark:bg-slate-900 dark:border-gray-700">
              <div className="relative">
                <textarea
                  id="chat-input"
                  className="ml-5 p-4 pb-12 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
                  placeholder="Enter your prompt"
                  rows={1}
                  value={inputText}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setInputText(e.target.value)
                  }
                  required
                ></textarea>
                <button
                  type="submit"
                  className="absolute bottom-5 right-2.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:text-base"
                >
                  Send <span className="sr-only">Send message</span>
                </button>
              </div>
            </footer>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Bubbles;
