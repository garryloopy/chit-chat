"use client";

import Image from "next/image";

import {
  findUserById,
  getUsers,
  addUser,
} from "@/app/_services/firebase-service";

import ChatContainer from "./components/ChatContainer";

import {
  IoLogoGithub,
  IoLogoGoogle,
  IoChevronBackSharp,
  IoSettingsSharp,
  IoGlobeSharp,
} from "react-icons/io5";

import { useUserAuth } from "./_utils/auth-context";

import { useState, useRef, useEffect } from "react";

const EMPTY_USER = {
  id: "",
  displayName: "",
  photoUrl: "",
};

const GLOBAL_USER = {
  id: "GLOBAL_CHAT",
  displayName: "Global chat",
  photoUrl:
    "https://images.pexels.com/photos/87651/earth-blue-planet-globe-planet-87651.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
};

export type User = {
  id: string;
  displayName: string;
  photoUrl: string;
};

export default function Home(): JSX.Element {
  // Authentication stuff
  const { user, gitHubSignIn, firebaseSignOut, googleSignIn } = useUserAuth();
  const [chatUser, setChatUser] = useState<User>(EMPTY_USER);

  const [users, setUsers] = useState<User[]>([]);

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
   * Use effect for when the user is signed in
   */
  useEffect(() => {
    /**
     * Handler for when the user signs in.
     * Checks if user is in the database, if not then add user to database.
     */
    const handleUserSignIn = async () => {
      const userInDB = await findUserById(user.uid);

      if (!userInDB) {
        addUser(user.uid, user.photoURL, user.displayName);
      }
    };

    /**
     * Handler for getting all users, filtered by user id
     */
    const handleGetUsers = async () => {
      let results = await getUsers();

      if (results) {
        setUsers(results.filter((currentUser) => currentUser.id !== user.uid));
      }
    };

    if (!user) {
      openSignInModal();
    } else {
      closeSignInModal();
      handleUserSignIn();
      handleGetUsers();
      setChatUser(GLOBAL_USER);
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
    setChatUser(EMPTY_USER);
  };

  /**
   * Handler for closing the hambueger menu
   */
  const handleOnHamburgerMenuClose = () => {
    setToggleHamburgerMenu(false);
  };

  /**
   * Handler for opening hamburger menu
   */
  const handleOnHamburgerMenuOpen = () => {
    setToggleHamburgerMenu(true);
  };

  const handleOnChatUserClick = (newChatUser: User) => {
    if (chatUser.id === newChatUser.id) {
      setChatUser(EMPTY_USER);
      return;
    }

    setChatUser(newChatUser);
    handleOnHamburgerMenuClose();
  };

  return (
    <main className="relative h-screen  w-full bg-stone-950 p-12 sm:p-4">
      {/* Log in modal */}
      <dialog ref={signInModalRef} className="overflow-hidden rounded-2xl">
        <div className="flex size-96 flex-col items-center justify-center gap-2 bg-stone-300">
          <p className="text-3xl font-bold text-stone-700">
            Sign in to get started
          </p>
          <button
            className="flex h-14 w-72 flex-row items-center gap-4 rounded-lg bg-stone-700 px-4 font-semibold text-stone-300"
            onClick={handleGitHubSignIn}
            autoFocus
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
      </dialog>

      {/* Account settings modal  */}
      <dialog
        ref={accountSettingsModalRef}
        className="overflow-hidden rounded-md"
      >
        <div className="flex min-w-64 flex-col items-center bg-stone-900 p-4 text-stone-50">
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
        </div>
      </dialog>

      {/* Hamburger menu  */}
      <div
        data-toggle={toggleHamburgerMenu}
        onClick={handleOnHamburgerMenuClose}
        className="pointer-events-none absolute left-0 top-0 z-10 h-full w-full opacity-0 transition-opacity duration-300 data-[toggle=true]:pointer-events-auto data-[toggle=true]:opacity-100"
      >
        {/* Container  */}
        <div
          className="flex h-full w-full flex-col justify-between bg-stone-950 py-16 sm:w-96 sm:p-8"
          onClick={(ev) => ev.stopPropagation()}
        >
          <button
            className="group flex h-12 w-full flex-row items-center justify-center gap-2 text-stone-300 hover:bg-stone-800 active:bg-stone-700"
            onClick={handleOnHamburgerMenuClose}
          >
            <IoChevronBackSharp
              size={28}
              className="transition-transform duration-300 ease-in-out group-hover:-translate-x-3"
            />
            Back
          </button>

          {/* <div className="flex w-full flex-col gap-2">
            <div className="flex w-full flex-col items-center justify-center rounded-lg bg-stone-900 py-2">
              <p className="mb-4 text-lg font-semibold text-stone-300">Chats</p>
              <button
                className="flex h-16 w-full flex-row items-center justify-center gap-4 overflow-hidden bg-stone-900 hover:bg-stone-800"
                onClick={() =>
                  handleOnChatUserClick({
                    id: "GLOBAL_CHAT",
                    displayName: "Global Chat",
                    photoUrl: user.photoURL,
                  })
                }
              >
                <IoGlobeSharp size={36} className="text-stone-300" />
                <div className="text-stone-400">
                  <p className="font-semibold text-stone-300">Global Chat</p>
                </div>
              </button>
            </div>
          </div> */}

          {/* Users section  */}
          {/* <div className="flex w-full flex-col gap-2">
            <div className="flex w-full flex-col items-center justify-center rounded-lg bg-stone-900 py-2">
              <p className="mb-4 text-lg font-semibold text-stone-300">Users</p>
              {users &&
                users.map((currentUser) => (
                  <button
                    className="flex h-16 w-full flex-row items-center justify-center gap-4 overflow-hidden bg-stone-900 hover:bg-stone-800"
                    onClick={() =>
                      handleOnChatUserClick({
                        id: currentUser.id,
                        displayName: currentUser.displayName,
                        photoUrl: currentUser.photoUrl,
                      })
                    }
                    key={currentUser.id}
                  >
                    <Image
                      src={currentUser.photoUrl}
                      width={52}
                      height={52}
                      alt="Profile picture"
                      className="rounded-full"
                    />
                    <div className="text-stone-400">
                      <p className="font-semibold text-stone-300">
                        {currentUser.displayName}
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          </div> */}

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
              <div className="flex w-full flex-row items-center justify-start gap-4 overflow-hidden rounded-lg bg-stone-900 p-2">
                <Image
                  src={user.photoURL}
                  width={40}
                  height={40}
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
      <ChatContainer
        onHamburgerMenuClick={handleOnHamburgerMenuOpen}
        chatUser={chatUser}
      />
    </main>
  );
}
