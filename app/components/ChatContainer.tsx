"use client";

import Image from "next/image";

import { useEffect, useRef, useState } from "react";

import ChatBubble from "./ChatBubble";

import {
  getChats,
  addChatPrompt,
  getChatsByChatId,
} from "../_services/firebase-service";

import { FormEvent, ChangeEvent } from "react";
import {
  IoEllipsisHorizontalSharp,
  IoChevronUpSharp,
  IoSendSharp,
  IoMenuSharp,
  IoChevronDownCircleSharp,
  IoChevronDownSharp,
} from "react-icons/io5";
import { Timestamp } from "firebase/firestore";
import { useUserAuth } from "../_utils/auth-context";
import { useChat } from "@/app/_utils/chat-context";

export type User = {
  id: string;
  displayName: string;
  photoUrl: string;
};

export type ChatPrompt = {
  contents: string;
  displayName: string;
  id: string;
  photoURL: string;
  time: Timestamp;
};

export type ChatContainerData = {
  onHamburgerMenuClick: Function;
  chatUser: User;
};

export type ChatContents = {
  chatId: string;
  displayName: string;
  contents: string;
  id: string;
  photoURL: string;
  time: {
    seconds: number;
    nanoseconds: number;
  };
};

export default function ChatContainer({
  onHamburgerMenuClick,
  chatUser,
}: ChatContainerData) {
  const { setChatUser, chats } = useChat();

  // State for more options in chat
  const [toggleMoreOptions, setToggleMoreOptions] = useState(false);
  const [chatContents, setChatContents] = useState<ChatContents[] | undefined>(
    chats,
  );

  const chatContainerRef = useRef(null);

  const { user } = useUserAuth();

  useEffect(() => {
    setChatContents(chats);

    setTimeout(() => {
      scrollToBottom();
    }, 250);
  }, [chats]);

  // State for the current chat value
  const [chatValue, setChatValue] = useState("");

  // State for disabling chat
  const [disableChat, setDisableChat] = useState(false);

  useEffect(() => {
    if (!chatUser.displayName && !chatUser.id && !chatUser.photoUrl) {
      setChatContents(undefined);
      return;
    }

    /**
     * A comparator for time using two date objects
     * @param a The first date object to compare
     * @param b The second date object to compare
     * @returns 1 if the first object if greater than the second, -1 if the first is less the the second, 0 if they are both equal
     */
    const timeComparator = (a: Date, b: Date) => {
      if (a.getTime() > b.getTime()) return 1;
      else if (a.getTime() < b.getTime()) return -1;
      else return 0;
    };

    /**
     * Loads the chats, sorted
     */
    const loadChats = async () => {
      const chats = await getChatsByChatId(chatUser.id);
      setChatUser(chatUser.id);

      const sorted = chats?.toSorted((a, b) => {
        const timeA = new Timestamp(
          a.time.seconds,
          b.time.nanoseconds,
        ).toDate();
        const timeB = new Timestamp(
          b.time.seconds,
          b.time.nanoseconds,
        ).toDate();
        return timeComparator(timeA, timeB);
      });
      setChatContents(sorted);
    };

    loadChats();
  }, [chatUser, setChatUser]);

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
    setDisableChat(true);
    event.preventDefault();

    if (chatValue.length <= 0) {
      setDisableChat(false);
      return;
    }

    const date = new Date();

    const time = Timestamp.fromDate(date);

    const chatPrompt: ChatPrompt = {
      contents: chatValue,
      displayName: user.displayName,
      id: user.uid,
      photoURL: user.photoURL,
      time: time,
    };

    const docRef = await addChatPrompt(chatUser.id, chatPrompt);

    setChatValue("");
    setDisableChat(false);
  };

  /**
   * Handler for value change in chat
   * @param event The event upon a value change
   */
  const handleOnChatValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    setChatValue(val);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current as HTMLDivElement;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const test = () => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current as HTMLDivElement;
      console.log(container.scrollHeight);
      container.scrollTo({
        top: container.scrollHeight + 100,
        behavior: "smooth",
      });
    }
  };

  /**
   * Handler for opening the hamburger menu
   */
  const handleOnHamburgerMenuClick = () => {
    onHamburgerMenuClick();
  };
  return (
    <div className="flex h-full w-full flex-col rounded-xl bg-stone-700">
      {/* Test  */}
      {/* <button
        className="absolute right-1/2 top-8 z-20 bg-gray-300 px-8 py-2"
        onClick={test}
      >
        Test
      </button> */}

      {/* Chat header  */}
      <div className="relative flex h-24 w-full items-center justify-between bg-stone-900/50  px-4">
        {/* Hamburger menu toggle  */}
        <button
          className="relative rounded-md p-2 text-stone-300 hover:bg-stone-800 active:bg-stone-700"
          onClick={handleOnHamburgerMenuClick}
        >
          <IoMenuSharp size={36} className="h-full w-full" />
        </button>
        {/* Profile image and name  */}
        <div className="flex flex-row items-center gap-4">
          {chatUser.photoUrl && (
            <Image
              src={chatUser.photoUrl}
              width={48}
              height={48}
              alt="Profile picture"
              className="rounded-full"
            />
          )}
          <p className="text-xl font-semibold text-stone-300">
            {chatUser.displayName && chatUser.displayName}
          </p>
        </div>
        {/* More options button  */}
        {chatUser.displayName && chatUser.id && chatUser.photoUrl && (
          <button
            className="pointer-events-none relative rounded-md p-2 text-stone-300 hover:bg-stone-800 active:bg-stone-700"
            onClick={handleOnMoreOptionsClick}
          >
            {/* {toggleMoreOptions ? (
              <IoChevronUpSharp size={40} className="h-full w-full" />
            ) : (
              <IoEllipsisHorizontalSharp size={40} className="h-full w-full" />
            )} */}
          </button>
        )}

        {/* More options  */}
        {/* <div
          className={`absolute right-0 top-[92px] min-w-96 rounded-b-lg border-2 border-stone-900 bg-stone-950 p-4 shadow-md ${toggleMoreOptions ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} transition-opacity duration-300`}
        >
          <button
            className="h-12 w-full text-stone-300 hover:bg-stone-800 active:bg-stone-700"
            onClick={handleOnMoreOptionsSelectionClick}
          >
            Delete chat
          </button>
        </div> */}
      </div>
      {/* Chat body  */}
      <div
        className="flex h-full w-full flex-col gap-10 overflow-auto p-12 text-2xl font-semibold text-stone-300"
        ref={chatContainerRef}
      >
        {chatContents &&
          user &&
          chatContents.map((currentChat) => {
            const chatId = currentChat.chatId;
            const displayName = currentChat.displayName;
            const contents = currentChat.contents;
            const id = currentChat.id;
            const photoURL = currentChat.photoURL;
            const time = currentChat.time;

            return (
              <ChatBubble
                createdAt={new Timestamp(
                  time.seconds,
                  time.nanoseconds,
                ).toDate()}
                name={displayName}
                contents={contents}
                image={photoURL}
                owner={user.uid === id}
                key={chatId}
              />
            );
          })}
      </div>
      {/* Chat footer  */}
      <form
        className="relative w-full bg-stone-900 p-4 sm:h-24"
        onSubmit={handleOnChatSubmit}
      >
        <div className="pointer-events-none absolute -top-14 grid w-full place-content-center">
          <button className="pointer-events-auto grid h-12 w-24 place-content-center rounded-lg bg-stone-400 shadow-md">
            <IoChevronDownSharp size={32} />
          </button>
        </div>
        <input
          type="text"
          onChange={handleOnChatValueChange}
          placeholder="Message"
          value={chatValue}
          className="h-full w-full rounded-lg bg-stone-500 px-8 text-lg text-stone-100 outline-none transition-shadow duration-100 placeholder:text-stone-300 focus:shadow-md focus:ring-1 focus:ring-stone-400 disabled:animate-pulse"
          disabled={disableChat}
        />
        <div className="pointer-events-none absolute inset-0 m-5 flex items-center justify-end">
          <button
            className="pointer-events-auto rounded-md p-2 px-4 text-stone-100"
            type="submit"
          >
            <IoSendSharp size={20} className="h-full w-full" />
          </button>
        </div>
      </form>
    </div>
  );
}
