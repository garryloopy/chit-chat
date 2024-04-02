"use client";

import Image from "next/image";

import {
  findUserById,
  getUsers,
  addUser,
} from "@/app/_services/firebase-service";

import ProfileTest from "@/public/images/ricardo.jpg";
import {
  IoEllipsisHorizontalSharp,
  IoChevronUpSharp,
  IoSendSharp,
  IoLogoGithub,
  IoLogoGoogle,
  IoMenuSharp,
  IoChevronBackSharp,
  IoSettingsSharp,
} from "react-icons/io5";

import { useUserAuth } from "./_utils/auth-context";

import ChatBubble from "@/app/components/ChatBubble";

import { useState, useRef, useEffect } from "react";

import { FormEvent, ChangeEvent } from "react";

export default function Home(): JSX.Element {
  // Authentication stuff
  const { user, gitHubSignIn, firebaseSignOut, googleSignIn } = useUserAuth();

  // Account settings modal state
  const [toggleAccountSettingsModal, setToggleAccountSettingsModal] =
    useState(false);

  // Hamburger menu state
  const [toggleHamburgerMenu, setToggleHamburgerMenu] = useState(false);

  // Account settings modal reference
  const accountSettingsModalRef = useRef<HTMLDialogElement>(null);

  // Account settings modal reference
  const signInModalRef = useRef<HTMLDialogElement>(null);

  /**
   * Opens the sign in modal
   */
  const openSignInModal = () => {
    if (signInModalRef.current) {
      signInModalRef.current.showModal();
    }
  };

  /**
   * Closes the sign in modal
   */
  const closeSignInModal = () => {
    if (signInModalRef.current) {
      signInModalRef.current.close();
    }
  };

  /**
   * Shows the sign in modal if user isnt logged in
   */
  useEffect(() => {
    const handleUserSignIn = async () => {
      const userInDB = await findUserById(user.uid);

      if (!userInDB) {
        addUser(user.uid, user.photoURL, user.displayName);
      }
    };

    if (!user) {
      openSignInModal();
    } else {
      closeSignInModal();
      handleUserSignIn();
    }
  }, [user]);

  /**
   * Opens the account settings modal
   */
  const openAccountSettingsModal = () => {
    setToggleAccountSettingsModal(true);
    if (accountSettingsModalRef.current) {
      accountSettingsModalRef.current.showModal();
    }
  };

  /**
   * Closes the account settings modal
   */
  const closeAccountSettingsModal = () => {
    setToggleAccountSettingsModal(false);
    if (accountSettingsModalRef.current) {
      accountSettingsModalRef.current.close();
    }
  };

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

  /**
   * Handler for GitHub sign in
   */
  const handleGitHubSignIn = async () => {
    await gitHubSignIn();
  };

  /**
   * Handler for Google sign in
   */
  const handleGoogleSignIn = async () => {
    await googleSignIn();
  };

  /**
   * Handler for signing out
   */
  const handleOnSignOut = () => {
    firebaseSignOut();
    closeAccountSettingsModal();
    setToggleHamburgerMenu(false);
  };

  const handleOnHamburgerMenuClick = () => {
    setToggleHamburgerMenu(true);
  };

  const handleOnHamburgerMenuClose = () => {
    setToggleHamburgerMenu(false);
  };

  const test = async () => {};

  return (
    <main className="relative h-screen w-full bg-stone-950 p-8">
      <button
        className="absolute right-1/2 top-8 z-20 bg-gray-300 px-8 py-2"
        onClick={test}
      >
        Test
      </button>
      {/* Log in modal */}
      {!user && (
        <dialog
          data-user={user != null}
          ref={signInModalRef}
          className="pointer-events-none flex size-96 flex-col items-center justify-center gap-2 rounded-2xl bg-stone-300 opacity-0 data-[user=false]:pointer-events-auto data-[user=false]:opacity-100"
        >
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
        </dialog>
      )}

      {/* Account settings modal  */}
      <dialog
        ref={accountSettingsModalRef}
        className={`flex min-w-64 flex-col items-center bg-stone-900 p-4 text-stone-50 ${toggleAccountSettingsModal && "pointer-events-auto opacity-100"} pointer-events-none rounded-md opacity-0`}
      >
        <button
          onClick={handleOnSignOut}
          className="h-12 w-full hover:bg-stone-800 active:bg-stone-700"
        >
          Sign out
        </button>
        <button
          onClick={closeAccountSettingsModal}
          className="h-12 w-full hover:bg-stone-800 active:bg-stone-700"
        >
          Close
        </button>
      </dialog>

      {/* Hamburger menu  */}
      <div
        data-toggle={toggleHamburgerMenu}
        className="pointer-events-none absolute left-0 top-0 z-10 h-full w-full bg-stone-950 p-8 opacity-0 data-[toggle=true]:pointer-events-auto data-[toggle=true]:opacity-100 sm:w-96"
      >
        {/* Container  */}
        <div className="flex h-full w-full flex-col justify-between ">
          <button
            className="flex h-12 w-full flex-row items-center justify-center gap-2 text-stone-300 hover:bg-stone-800 active:bg-stone-700"
            onClick={handleOnHamburgerMenuClose}
          >
            <IoChevronBackSharp size={28} />
            Back
          </button>

          <div className="flex w-full flex-col gap-2">
            <div className="flex w-full flex-col items-center justify-center rounded-lg bg-stone-900 py-2">
              <p className="mb-4 text-lg font-semibold text-stone-300">Users</p>
              <button
                className="flex h-12 w-full flex-row items-center justify-center gap-2 text-stone-300 hover:bg-stone-800 active:bg-stone-700"
                onClick={openAccountSettingsModal}
              >
                <IoSettingsSharp size={28} />
                Account Settings
              </button>
            </div>
          </div>

          {user && (
            <div className="flex w-full flex-col gap-2">
              <div className="flex w-full flex-col items-center justify-center rounded-lg bg-stone-900 py-2">
                <p className="mb-4 text-lg font-semibold text-stone-300">
                  Account
                </p>
                <button
                  className="flex h-12 w-full flex-row items-center justify-center gap-2 text-stone-300 hover:bg-stone-800 active:bg-stone-700"
                  onClick={openAccountSettingsModal}
                >
                  <IoSettingsSharp size={28} />
                  Account Settings
                </button>
              </div>
              <div className="flex w-full flex-row items-center justify-start gap-2 overflow-hidden rounded-lg bg-stone-900">
                <Image
                  src={user.photoURL}
                  width={64}
                  height={64}
                  alt="Profile picture"
                  className="rounded-lg"
                />
                <div className="text-stone-400">
                  <p>Signed in as</p>
                  <p className="font-semibold text-stone-300">
                    {user.displayName}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat container  */}
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
          <ChatBubble image={ProfileTest} owner={false}>
            Cupidatat irure esse dolore deserunt enim exercitation enim ea
            officia quis ea ipsum. Laborum ea enim tempor consequat est. Aliquip
            incididunt sint consequat ex. Anim culpa enim id proident duis esse.
            Nisi velit dolore et ullamco ipsum sit nulla et nisi. Non nisi duis
            sint laborum magna. Nulla ullamco commodo cillum quis aliqua quis
            officia laboris sint ut occaecat id esse occaecat.
          </ChatBubble>
          <ChatBubble image={ProfileTest} owner={true}>
            Cupidatat irure esse dolore deserunt enim exercitation enim ea
            officia quis ea ipsum. Laborum ea enim tempor consequat est. Aliquip
            incididunt sint consequat ex. Anim culpa enim id proident duis esse.
            Nisi velit dolore et ullamco ipsum sit nulla et nisi. Non nisi duis
            sint laborum magna. Nulla ullamco commodo cillum quis aliqua quis
            officia laboris sint ut occaecat id esse occaecat.
          </ChatBubble>
          <ChatBubble image={ProfileTest} owner={true}>
            Cupidatat irure esse dolore deserunt enim exercitation enim ea
            officia quis ea ipsum. Laborum ea enim tempor consequat est. Aliquip
            incididunt sint consequat ex. Anim culpa enim id proident duis esse.
            Nisi velit dolore et ullamco ipsum sit nulla et nisi. Non nisi duis
            sint laborum magna. Nulla ullamco commodo cillum quis aliqua quis
            officia laboris sint ut occaecat id esse occaecat.
          </ChatBubble>
          <ChatBubble image={ProfileTest} owner={true}>
            Cupidatat irure esse dolore deserunt enim exercitation enim ea
            officia quis ea ipsum. Laborum ea enim tempor consequat est. Aliquip
            incididunt sint consequat ex. Anim culpa enim id proident duis esse.
            Nisi velit dolore et ullamco ipsum sit nulla et nisi. Non nisi duis
            sint laborum magna. Nulla ullamco commodo cillum quis aliqua quis
            officia laboris sint ut occaecat id esse occaecat.
          </ChatBubble>
          <ChatBubble image={ProfileTest} owner={false}>
            Cupidatat irure esse dolore deserunt enim exercitation enim ea
            officia quis ea ipsum. Laborum ea enim tempor consequat est. Aliquip
            incididunt sint consequat ex. Anim culpa enim id proident duis esse.
            Nisi velit dolore et ullamco ipsum sit nulla et nisi. Non nisi duis
            sint laborum magna. Nulla ullamco commodo cillum quis aliqua quis
            officia laboris sint ut occaecat id esse occaecat.
          </ChatBubble>
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
