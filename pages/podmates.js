import { ArrowLeftCircleIcon, EnvelopeIcon } from "@heroicons/react/20/solid";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from "reactfire";
import AuthWrapper from "../components/AuthWrapper";
import Button, { ButtonVariants } from "../components/Button/Button";
import Input from "../components/Input/Input";
import ProfilePicture, {
  ProfilePictureSize,
} from "../components/Profile/ProfilePicture";
import AppLayout from "../layouts/app";

function InviteForm({ user }) {
  const firestore = useFirestore();

  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await addDoc(collection(firestore, "invites"), {
        from: user.uid,
        to: value,
      });
      setValue("");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 md:col-span-2">
          <Input
            label={"Phone number or email"}
            value={value}
            disabled={loading}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <div className="col-span-1 h-full flex items-end justify-end">
          <Button
            onClick={onSubmit}
            icon={EnvelopeIcon}
            label="Send"
            loading={loading}
          />
        </div>
      </div>
    </form>
  );
}

function ReceivedInvites({ profile, user }) {
  const firestore = useFirestore();

  const invitesCollection = collection(firestore, "invites");
  const invitesQuery = query(
    invitesCollection,
    where("to", "in", [user.email, profile.phoneNumber])
  );

  const [inviteProfiles, setInviteProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const { status: invitesStatus, data: invites } = useFirestoreCollectionData(
    invitesQuery,
    { idField: "id" }
  );

  const fetchInviteProfiles = async (invites) => {
    setInviteProfiles([]);

    const profiles = [];

    for (let i = 0; i < invites.length; i++) {
      const invite = invites[i];
      const docSnap = await getDoc(doc(firestore, "users", invite.from));

      const { displayName, photoURL } = docSnap.data();

      profiles.push({
        ...invite,
        displayName,
        photoURL,
      });
    }
    setInviteProfiles(profiles);
  };

  const deleteInvite = async (invite) => {
    return deleteDoc(doc(firestore, "invites", invite.id));
  };

  const onAccept = async (invite) => {
    setLoading(true);
    try {
      await setDoc(
        doc(firestore, "users", user.uid),
        {
          podmates: [...(profile.podmates ?? []), invite.from],
        },
        { merge: true }
      );

      await setDoc(
        doc(firestore, "users", invite.from),
        {
          podmates: [...(invite.podmates ?? []), user.uid],
        },
        { merge: true }
      );

      await deleteInvite(invite);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  const onReject = async (invite) => {
    setLoading(true);
    try {
      await deleteInvite(invite);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (invites) {
      fetchInviteProfiles(invites);
    }
  }, [invites]);

  return (
    <>
      {invitesStatus == "loading" && (
        <div className="w-full h-32 animate-pulse rounded-lg bg-gray-200"></div>
      )}
      {invitesStatus != "loading" && inviteProfiles.length > 0 && (
        <ul className="space-y-4">
          {inviteProfiles.map((inviteProfile) => (
            <li
              className="flex flex-row justify-between items-center w-full"
              key={inviteProfile.from}
            >
              <div className="flex flex-row items-center space-x-4">
                <ProfilePicture
                  displayName={inviteProfile.displayName}
                  photoURL={inviteProfile.photoURL}
                  size={ProfilePictureSize.medium}
                />
                <p className="text-lg text-gray-700 font-medium">
                  {inviteProfile.displayName}
                </p>
              </div>
              <div className="flex flex-row space-x-2">
                <Button
                  label="Accept"
                  onClick={() => onAccept(inviteProfile)}
                  loading={loading}
                ></Button>
                <Button
                  variant={ButtonVariants.Text}
                  label="Delete"
                  onClick={() => onReject(inviteProfile)}
                  loading={loading}
                ></Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {invitesStatus != "loading" && inviteProfiles.length <= 0 && (
        <div>
          <p className="text-lg font-medium text-gray-700">
            No pending invites. Check back later!
          </p>
        </div>
      )}
    </>
  );
}

function PageContents({ user }) {
  const firestore = useFirestore();
  const { status: profileStatus, data: profile } = useFirestoreDocData(
    doc(firestore, "users", user.uid)
  );

  return (
    <AppLayout>
      <div className="mb-16">
        <Button
          icon={ArrowLeftCircleIcon}
          variant={ButtonVariants.Text}
          label="Back to feed"
          isLink={true}
          href={"/feed"}
        />
      </div>
      <div className="pb-8 border-b border-gray-300">
        <p className="mb-4 text-sm font-medium text-gray-700">
          Invite someone to be your PodMate
        </p>
        <div>
          <InviteForm user={user} />
        </div>
      </div>
      {profile && (
        <div className="py-8">
          <p className="mb-4 text-sm font-medium text-gray-700">
            Invites awaiting your response
          </p>
          <div>
            <ReceivedInvites user={user} profile={profile} />
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default function PodmatesPage() {
  return <AuthWrapper toRender={PageContents} />;
}
