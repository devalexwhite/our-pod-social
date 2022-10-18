import { collection, documentId, query, where } from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import ProfilePicture from "./Profile/ProfilePicture";

export default function PodmateSelector({ podmates, value, onChange }) {
  const firestore = useFirestore();
  const usersCollection = collection(firestore, "users");
  const usersQuery = query(
    usersCollection,
    where(documentId(), "in", podmates)
  );

  const { status: profilesStatus, data: profiles } = useFirestoreCollectionData(
    usersQuery,
    { idField: "id" }
  );

  const onChangeInner = (podmate) => {
    if (value?.id == podmate.id) onChange(null);
    else onChange(podmate);
  };

  return (
    <ul className="flex flex-row space-x-4 items-center justify-center w-full">
      {(profiles ?? []).map((profile) => (
        <li key={profile.id}>
          <ProfilePicture
            displayName={profile.displayName}
            photoURL={profile.photoURL}
            onClick={() => onChangeInner(profile)}
            selected={value?.id == profile.id}
          />
        </li>
      ))}
    </ul>
  );
}
