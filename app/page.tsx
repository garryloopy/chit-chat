"use client";

import Image from "next/image";

import ProfileTest from "@/public/images/ricardo.jpg";
import {
  IoEllipsisHorizontalSharp,
  IoChevronUpSharp,
  IoSendSharp,
  IoLogoGithub,
  IoLogoGoogle,
} from "react-icons/io5";

import { useUserAuth } from "./_utils/auth-context";

import ChatBubble from "@/app/components/ChatBubble";

import { useState } from "react";

import { FormEvent, ChangeEvent } from "react";

export default function Home(): JSX.Element {
  // Authentication stuff
  const { user, gitHubSignIn, firebaseSignOut, googleSignIn } = useUserAuth();

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

  const handleGitHubSignIn = async () => {
    await gitHubSignIn();
  };
  const handleGoogleSignIn = async () => {
    await googleSignIn();
  };

  return (
    <main className="relative h-screen w-full bg-stone-950 p-8">
      {/* Log in modal */}
      <div
        data-user={user !== null}
        className="absolute bottom-0 left-0 right-0 top-0 z-10 grid h-full w-full place-items-center backdrop-blur-sm data-[user=false]:opacity-100 data-[user=true]:opacity-0"
      >
        {/* Container  */}
        <div className="flex size-96 flex-col items-center justify-center gap-2 rounded-2xl bg-stone-300">
          <p className="text-3xl font-bold text-stone-700">
            Sign in to get started
          </p>
          <button
            className="flex h-14 w-72 flex-row items-center gap-4 rounded-lg bg-stone-700 px-4 font-semibold text-stone-300"
            onClick={handleGitHubSignIn}
          >
            <IoLogoGithub size={36} />
            Sign in with GitHub
          </button>
          <button
            className="flex h-14 w-72 flex-row items-center gap-4 rounded-lg bg-stone-700 px-4 font-semibold text-stone-300"
            onClick={handleGoogleSignIn}
          >
            <IoLogoGoogle size={36} />
            Sign in with Google
          </button>
        </div>
      </div>

      {/* Chat container  */}
      <div className="flex h-full w-full flex-col overflow-hidden rounded-xl bg-stone-700">
        {/* Chat header  */}
        <div className="relative flex h-28 w-full items-center justify-between bg-stone-900/50 px-4">
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
            className={`absolute right-0 top-[92px] min-w-96 rounded-b-lg border-2 border-stone-900 bg-stone-950 p-4 text-stone-300 shadow-md ${toggleMoreOptions ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"} transition-opacity duration-300`}
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
        <div className="flex h-full w-full flex-col gap-4 overflow-auto p-12 text-2xl font-semibold text-stone-300">
          {/* <ChatBubble image={ProfileTest} isSelf={false}>
            Cupidatat irure esse dolore deserunt enim exercitation enim ea
            officia quis ea ipsum. Laborum ea enim tempor consequat est. Aliquip
            incididunt sint consequat ex. Anim culpa enim id proident duis esse.
            Nisi velit dolore et ullamco ipsum sit nulla et nisi. Non nisi duis
            sint laborum magna. Nulla ullamco commodo cillum quis aliqua quis
            officia laboris sint ut occaecat id esse occaecat.
          </ChatBubble>
          <ChatBubble image={ProfileTest} isSelf={true}>
            Cupidatat irure esse dolore deserunt enim exercitation enim ea
            officia quis ea ipsum. Laborum ea enim tempor consequat est. Aliquip
            incididunt sint consequat ex. Anim culpa enim id proident duis esse.
            Nisi velit dolore et ullamco ipsum sit nulla et nisi. Non nisi duis
            sint laborum magna. Nulla ullamco commodo cillum quis aliqua quis
            officia laboris sint ut occaecat id esse occaecat.
          </ChatBubble>
          <ChatBubble image={ProfileTest} isSelf={true}>
            Cupidatat irure esse dolore deserunt enim exercitation enim ea
            officia quis ea ipsum. Laborum ea enim tempor consequat est. Aliquip
            incididunt sint consequat ex. Anim culpa enim id proident duis esse.
            Nisi velit dolore et ullamco ipsum sit nulla et nisi. Non nisi duis
            sint laborum magna. Nulla ullamco commodo cillum quis aliqua quis
            officia laboris sint ut occaecat id esse occaecat.
          </ChatBubble>
          <ChatBubble image={ProfileTest} isSelf={true}>
            Cupidatat irure esse dolore deserunt enim exercitation enim ea
            officia quis ea ipsum. Laborum ea enim tempor consequat est. Aliquip
            incididunt sint consequat ex. Anim culpa enim id proident duis esse.
            Nisi velit dolore et ullamco ipsum sit nulla et nisi. Non nisi duis
            sint laborum magna. Nulla ullamco commodo cillum quis aliqua quis
            officia laboris sint ut occaecat id esse occaecat.
          </ChatBubble>
          <ChatBubble image={ProfileTest} isSelf={false}>
            Cupidatat irure esse dolore deserunt enim exercitation enim ea
            officia quis ea ipsum. Laborum ea enim tempor consequat est. Aliquip
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
    </main>
  );
}
