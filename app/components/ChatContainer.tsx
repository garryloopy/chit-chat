"use client";

import Image from "next/image";

import { useEffect, useState } from "react";

import ChatBubble from "./ChatBubble";

import {
  getChats,
  addChatPrompt,
  getChatsByChatId,
} from "../_services/firebase-service";

import ProfileTest from "@/public/images/ricardo.jpg";
import { FormEvent, ChangeEvent } from "react";
import {
  IoEllipsisHorizontalSharp,
  IoChevronUpSharp,
  IoSendSharp,
  IoMenuSharp,
} from "react-icons/io5";
import { Timestamp } from "firebase/firestore";
import { useUserAuth } from "../_utils/auth-context";

export type User = {
  id: string;
  displayName: string;
  photoUrl: string;
};

export type ChatPrompt = {
  content: string;
  displayName: string;
  id: string;
  photoURL: string;
  time: Timestamp;
};

type ChatContainerData = {
  onHamburgerMenuClick: Function;
  chatUser: User;
};

export default function ChatContainer({
  onHamburgerMenuClick,
  chatUser,
}: ChatContainerData) {
  // State for more options in chat
  const [toggleMoreOptions, setToggleMoreOptions] = useState(false);
  const [chatContents, setChatContents] = useState();

  const { user } = useUserAuth();

  // State for the current chat value
  const [chatValue, setChatValue] = useState("");

  useEffect(() => {
    if (!chatUser.displayName && !chatUser.id && !chatUser.photoUrl) return;

    const getChats = async () => {
      const chats = await getChatsByChatId(chatUser.id);
      console.log(chats);
      setChatContents(chats);
      return chats;
    };

    const chat = getChats();

    console.log(chat);
  }, [chatUser]);

  /**
   * Handler for toggling more options button found on chat container
   */
  const handleOnMoreOptionsClick = () => {
    setToggleMoreOptions(!toggleMoreOptions);
  };

  /**
   * Handler when a more options selection is clicked
   */
  const handleOnMoreOptionsSelectionClick = () => {
    setToggleMoreOptions(false);
  };

  /**
   * Handler for chat submission
   * @param event The form event upon submission
   */
  const handleOnChatSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (chatValue.length <= 0) return;

    const date = new Date();

    const time = Timestamp.fromDate(date);

    console.log(time);

    const chatPrompt: ChatPrompt = {
      content: chatValue,
      displayName: user.displayName,
      id: user.uid,
      photoURL: user.photoURL,
      time: time,
    };

    const docRef = await addChatPrompt(chatUser.id, chatPrompt);

    console.log(docRef);

    setChatValue("");
  };

  /**
   * Handler for value change in chat
   * @param event The event upon a value change
   */
  const handleOnChatValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    setChatValue(val);
  };

  /**
   * Handler for opening the hamburger menu
   */
  const handleOnHamburgerMenuClick = () => {
    onHamburgerMenuClick();
  };
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-stone-700">
      {/* Chat header  */}
      <div className="relative flex h-28 w-full items-center justify-between bg-stone-900/50 px-4">
        {/* Hamburger menu toggle  */}
        <button
          className="relative rounded-md p-2 text-stone-300 hover:bg-stone-800 active:bg-stone-700"
          onClick={handleOnHamburgerMenuClick}
        >
          <IoMenuSharp size={40} className="h-full w-full" />
        </button>
        {/* Profile image and name  */}
        <div className="flex flex-row items-center gap-4">
          {chatUser.photoUrl && (
            <Image
              src={chatUser.photoUrl}
              width={64}
              height={64}
              alt="Profile picture"
              className="rounded-full"
            />
          )}
          <p className="text-2xl font-semibold text-stone-300">
            {chatUser.displayName && chatUser.displayName}
          </p>
        </div>
        {/* More options button  */}
        {chatUser.displayName && chatUser.id && chatUser.photoUrl && (
          <button
            className="relative rounded-md p-2 text-stone-300 hover:bg-stone-800 active:bg-stone-700"
            onClick={handleOnMoreOptionsClick}
          >
            {toggleMoreOptions ? (
              <IoChevronUpSharp size={40} className="h-full w-full" />
            ) : (
              <IoEllipsisHorizontalSharp size={40} className="h-full w-full" />
            )}
          </button>
        )}

        {/* More options  */}
        <div
          className={`absolute right-0 top-[92px] min-w-96 rounded-b-lg border-2 border-stone-900 bg-stone-950 p-4 shadow-md ${toggleMoreOptions ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} transition-opacity duration-300`}
        >
          <button
            className="h-12 w-full text-stone-300 hover:bg-stone-800 active:bg-stone-700"
            onClick={handleOnMoreOptionsSelectionClick}
          >
            Delete chat
          </button>
        </div>
      </div>
      {/* Chat body  */}
      <div className="flex h-full w-full flex-col gap-4 overflow-auto p-12 text-2xl font-semibold text-stone-300">
        {/* <ChatBubble image={ProfileTest} owner={false}>
          Cupidatat irure esse dolore deserunt enim exercitation enim ea officia
          quis ea ipsum. Laborum ea enim tempor consequat est. Aliquip
          incididunt sint consequat ex. Anim culpa enim id proident duis esse.
          Nisi velit dolore et ullamco ipsum sit nulla et nisi. Non nisi duis
          sint laborum magna. Nulla ullamco commodo cillum quis aliqua quis
          officia laboris sint ut occaecat id esse occaecat.
        </ChatBubble>
        <ChatBubble image={ProfileTest} owner={true}>
          Cupidatat irure esse dolore deserunt enim exercitation enim ea officia
          quis ea ipsum. Laborum ea enim tempor consequat est. Aliquip
          incididunt sint consequat ex. Anim culpa enim id proident duis esse.
          Nisi velit dolore et ullamco ipsum sit nulla et nisi. Non nisi duis
          sint laborum magna. Nulla ullamco commodo cillum quis aliqua quis
          officia laboris sint ut occaecat id esse occaecat.
        </ChatBubble>
        <ChatBubble image={ProfileTest} owner={true}>
          Cupidatat irure esse dolore deserunt enim exercitation enim ea officia
          quis ea ipsum. Laborum ea enim tempor consequat est. Aliquip
          incididunt sint consequat ex. Anim culpa enim id proident duis esse.
          Nisi velit dolore et ullamco ipsum sit nulla et nisi. Non nisi duis
          sint laborum magna. Nulla ullamco commodo cillum quis aliqua quis
          officia laboris sint ut occaecat id esse occaecat.
        </ChatBubble>
        <ChatBubble image={ProfileTest} owner={true}>
          Cupidatat irure esse dolore deserunt enim exercitation enim ea officia
          quis ea ipsum. Laborum ea enim tempor consequat est. Aliquip
          incididunt sint consequat ex. Anim culpa enim id proident duis esse.
          Nisi velit dolore et ullamco ipsum sit nulla et nisi. Non nisi duis
          sint laborum magna. Nulla ullamco commodo cillum quis aliqua quis
          officia laboris sint ut occaecat id esse occaecat.
        </ChatBubble>
        <ChatBubble image={ProfileTest} owner={false}>
          Cupidatat irure esse dolore deserunt enim exercitation enim ea officia
          quis ea ipsum. Laborum ea enim tempor consequat est. Aliquip
          incididunt sint consequat ex. Anim culpa enim id proident duis esse.
          Nisi velit dolore et ullamco ipsum sit nulla et nisi. Non nisi duis
          sint laborum magna. Nulla ullamco commodo cillum quis aliqua quis
          officia laboris sint ut occaecat id esse occaecat.
        </ChatBubble> */}
      </div>
      {/* Chat footer  */}
      <form
        className="relative h-32 w-full bg-stone-900 p-6"
        onSubmit={handleOnChatSubmit}
      >
        <input
          type="text"
          onChange={handleOnChatValueChange}
          placeholder="Message"
          value={chatValue}
          className="h-full w-full rounded-3xl bg-stone-500 px-8 text-lg text-stone-100 outline-none transition-shadow duration-300 placeholder:text-stone-300 focus:ring focus:ring-stone-400"
        />
        <div className="pointer-events-none absolute inset-0 m-5 flex items-center justify-end">
          <button
            className="pointer-events-auto rounded-md p-2 px-8 text-stone-100"
            type="submit"
          >
            <IoSendSharp size={24} className="h-full w-full" />
          </button>
        </div>
      </form>
    </div>
  );
}
