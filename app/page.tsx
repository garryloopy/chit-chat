"use client";

import Image from "next/image";

import ProfileTest from "@/public/images/ricardo.jpg";
import {
  IoEllipsisHorizontalSharp,
  IoChevronUpSharp,
  IoSendSharp,
} from "react-icons/io5";

import { useState } from "react";

import { FormEvent, ChangeEvent } from "react";

export default function Home(): JSX.Element {
  // State for more options in chat
  const [toggleMoreOptions, setToggleMoreOptions] = useState(false);

  // State for the current chat value
  const [chatValue, setChatValue] = useState("");

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
  const handleOnChatSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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

  return (
    <main className="h-screen w-full bg-stone-950 p-4">
      {/* Chat container  */}
      <div className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-stone-700">
        {/* Chat header  */}
        <div className="relative flex h-24 w-full items-center justify-between bg-stone-900 px-4">
          {/* Profile image and name  */}
          <div className="flex flex-row items-center gap-4">
            <Image
              src={ProfileTest}
              width={64}
              height={64}
              alt="Profile picture"
              className="rounded-full"
            />
            <p className="text-2xl font-semibold text-stone-300">
              Ricardo Milos
            </p>
          </div>
          {/* More options button  */}
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

          {/* More options  */}
          <div
            className={`absolute right-0 top-[84px] min-w-96 rounded-b-lg border-2 border-stone-900 bg-stone-950 p-4 text-stone-300 shadow-md ${toggleMoreOptions ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} transition-opacity duration-300`}
          >
            <button
              className="h-12 w-full hover:bg-stone-800 active:bg-stone-700"
              onClick={handleOnMoreOptionsSelectionClick}
            >
              Delete chat
            </button>
          </div>
        </div>
        {/* Chat body  */}
        <div className="h-full w-full"></div>
        {/* Chat footer  */}
        <form
          className="relative h-24 w-full bg-stone-900 p-5"
          onSubmit={handleOnChatSubmit}
        >
          <input
            type="text"
            onChange={handleOnChatValueChange}
            placeholder="Message"
            value={chatValue}
            className="h-full w-full rounded-lg bg-stone-500 px-4 text-lg text-stone-100 outline-none transition-shadow duration-300 placeholder:text-stone-300 focus:ring focus:ring-stone-400"
          />
          <div className="pointer-events-none absolute inset-0 m-5 flex items-center justify-end">
            <button
              className="pointer-events-auto rounded-md p-2 px-4 text-stone-100"
              type="submit"
            >
              <IoSendSharp size={24} className="h-full w-full" />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
