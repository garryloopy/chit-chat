import { db } from "@/app/_utils/firebase";
import {
  getDocs,
  collection,
  doc,
  getDoc,
  setDoc,
  query,
} from "firebase/firestore";

export async function findUserById(id) {
  try {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Something went wrong with fetching user");
  }
}

export async function addUser(id, photoUrl, displayName) {
  try {
    await setDoc(doc(db, "users", id), { photoUrl, displayName });
  } catch (error) {
    console.error("Failed to add user by id:", error.toString());
  }
}

export async function getChats() {
  const chatIds = await getChatIds();

  const users = Promise.all(
    chatIds.map(async (chatId) => await getUsersByChatId(chatId)),
  );

  return users;
}

// type User = {
//   id: string;
//   displayName: string;
//   photoUrl: string;
// };

async function getUsersByChatId(chatId) {
  try {
    const chatsCollection = collection(db, "chats", chatId, "users");
    const querySnapshot = await getDocs(chatsCollection);
    const users = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        displayName: data.displayName,
        photoUrl: data.photoUrl,
      };
    });

    return {
      chatId: chatId,
      users: users,
    };
  } catch (error) {
    console.error("Failed to users");
  }
}

async function getChatIds() {
  try {
    const chatsCollection = collection(db, "chats");
    const querySnapshot = await getDocs(chatsCollection);
    const chats = querySnapshot.docs.map((doc) => doc.id);

    return chats;
  } catch (error) {
    console.error("Failed to get chats", error);
  }
}

export async function getUsers() {
  try {
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(usersCollection);

    const users = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        displayName: data.displayName,
        photoUrl: data.photoUrl,
      };
    });

    return users;
  } catch (error) {
    console.error("Failed to get users");
  }
}
