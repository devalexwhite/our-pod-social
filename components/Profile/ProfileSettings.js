import { doc } from "firebase/firestore";
import { useFirestore, useFirestoreDocData, useUser } from "reactfire";

export default function ProfileForm() {
  const firestore = useFirestore();
  const profileRef = doc(firestore, "users", user.data.uid);

  const [userStatus, { data: user }] = useUser();
  const [profileStatus, { data: profile }] = useFirestoreDocData(profileRef);
}
