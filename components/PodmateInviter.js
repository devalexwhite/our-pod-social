import { EnvelopeIcon } from "@heroicons/react/20/solid";

import {
  addDoc,
  collection,
  doc,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { onChange } from "../lib/FormHelpers";
import Button, { ButtonVariants } from "./Button/Button";
import Input from "./Input/Input";
import ProfilePicture, { ProfilePictureSize } from "./Profile/ProfilePicture";

export default function PodmateInviter({ user }) {
  const firestore = useFirestore();
  const [invite, setInvite] = useState({ email: "" });
  const [sending, setSending] = useState(false);
  const invitesQuery = query(
    collection(firestore, "invites"),
    where("sender", "==", user.uid)
  );

  const { status, data: invites } = useFirestoreCollectionData(invitesQuery);

  const onSubmitInvite = async (e) => {
    e.preventDefault();

    setSending(true);

    await addDoc(collection(firestore, "invites"), {
      sender: user.uid,
      email: invite.email,
    });

    setInvite({ email: "" });
    setSending(false);
  };

  return (
    <div>
      <ul role="list" className="divide-y divide-gray-200">
        {(invites ?? []).map((invite) => (
          <li key={invite.id} className="flex py-4">
            <ProfilePicture size={ProfilePictureSize.medium} />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {invite.email}
              </p>
              <p className="text-sm text-gray-500">Invite sent!</p>
            </div>
          </li>
        ))}
      </ul>
      <form>
        <div className="grid grid-cols-3 gap-4 w-full">
          <div className="col-span-2">
            <Input
              name="email"
              label="Email address"
              type="email"
              value={invite.email}
              onChange={(e) => onChange(e, setInvite)}
            />
          </div>
          <div className="col-span-1 h-full flex items-end">
            <Button
              variant={ButtonVariants.Text}
              label={sending ? "Sending..." : "Send Invite"}
              icon={EnvelopeIcon}
              onClick={onSubmitInvite}
              loading={sending}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
