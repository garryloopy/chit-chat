import { db } from "@/app/_utils/firebase";
import { getDocs, collection, doc, getDoc, setDoc } from "firebase/firestore";

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

export async function getUsers() {
  try {
    const usersCollection = collection(db, "users");
    const querySnapshot = await getDocs(usersCollection);

    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return users;
  } catch (error) {
    console.error("Failed to get users");
  }
}
