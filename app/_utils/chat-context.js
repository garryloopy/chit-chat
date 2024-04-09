"use client";

import { useContext, createContext, useState, useEffect } from "react";
import {
  collection,
  doc,
  onSnapshot,
  query,
  Timestamp,
} from "firebase/firestore";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GithubAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "./firebase";
import { db } from "./firebase";
import { useUserAuth } from "./auth-context";

const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const [chatUserId, setChatUserId] = useState("");
  const [chats, setChats] = useState(null);
  const { user } = useUserAuth();

  const test = "test";

  const setChatUser = (id) => {
    setChatUserId(id);
  };

  useEffect(() => {
    if (!chatUserId || !user) return;

    /**
     * A comparator for time using two date objects
     * @param a The first date object to compare
     * @param b The second date object to compare
     * @returns 1 if the first object if greater than the second, -1 if the first is less the the second, 0 if they are both equal
     */
    const timeComparator = (a, b) => {
      if (a.getTime() > b.getTime()) return 1;
      else if (a.getTime() < b.getTime()) return -1;
      else return 0;
    };

    const q = query(collection(db, "chats", chatUserId, "data"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chats = [];
      querySnapshot.forEach((doc) => {
        const docRef = doc.id;
        const data = doc.data();
        chats.push({ chatId: docRef, ...data });
      });

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

      setChats(sorted);
    });

    return () => unsubscribe();
  }, [chatUserId, user]);

  //   useEffect(() => {
  //     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //       setUser(currentUser);
  //     });
  //     return () => unsubscribe();
  //   }, [user]);

  return (
    <ChatContext.Provider value={{ chats, setChatUser }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  return useContext(ChatContext);
};
