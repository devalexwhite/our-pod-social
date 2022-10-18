import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/20/solid";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref as sRef, uploadBytes } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useStorage,
} from "reactfire";
import AuthWrapper from "../components/AuthWrapper";
import Button, { ButtonVariants } from "../components/Button/Button";
import Input from "../components/Input/Input";
import LoadingSpinner from "../components/LoadingSpinner";
import ProfilePicture, {
  ProfilePictureSize,
} from "../components/Profile/ProfilePicture";
import AppLayout from "../layouts/app";
import { onChange } from "../lib/FormHelpers";

function PageContents({ user }) {
  const firestore = useFirestore();
  const fileRef = useRef(null);
  const [state, setState] = useState({
    photoURL: user.photoURL,
  });
  const [loading, setLoading] = useState(false);
  const storage = useStorage();
  const { status: profileStatus, data: profile } = useFirestoreDocData(
    doc(firestore, "users", user.uid)
  );

  const onClickProfilePicture = (e) => {
    e.preventDefault();
    fileRef.current.click();
  };

  const onProfilePictureChange = (e) => {
    setState((prev) => ({
      ...prev,
      photoURL: URL.createObjectURL(e.target.files[0]),
      file: e.target.files[0],
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoURL = user.photoURL;

      if (state.file) {
        const storageRef = sRef(storage, `${user.uid}/${state.file.name}`);
        const uploadResult = await uploadBytes(storageRef, state.file);
        photoURL = await getDownloadURL(uploadResult.ref);
      }

      await updateProfile(user, {
        displayName: state.displayName,
        photoURL,
      });

      await setDoc(
        doc(firestore, "users", user.uid),
        {
          phoneNumber: state.phoneNumber,
          displayName: state.displayName,
          uid: user.uid,
          photoURL,
          email: user.email,
        },
        { merge: true }
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (profile) setState({ ...profile, photoURL: user.photoURL });
  }, [profile]);

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
      {profile && (
        <form className="mt-8 space-y-6 text-lg">
          <div>
            <label
              htmlFor="photoURL"
              id="photoURL"
              className="block text-sm font-medium text-gray-700"
            >
              Profile picture
            </label>
            <input
              name="photoURL"
              id="photoURL"
              type="file"
              hidden={true}
              ref={fileRef}
              accept="image/*"
              onChange={onProfilePictureChange}
            />
            <div className="mt-1">
              <ProfilePicture
                photoURL={state.photoURL}
                size={ProfilePictureSize.xlarge}
                onClick={onClickProfilePicture}
              />
            </div>
          </div>
          <Input
            type="text"
            label="Full name"
            name="displayName"
            placeholder="Tom Baker"
            value={state.displayName}
            onChange={(e) => onChange(e, setState)}
          />
          <Input
            type="tel"
            label="Phone number"
            name="phoneNumber"
            placeholder="1234567890"
            value={state.phoneNumber}
            onChange={(e) => onChange(e, setState)}
          />
          <Input
            type="email"
            label="Email"
            name="email"
            value={user.email}
            disabled={true}
          />
          <div className="mt-8">
            <Button
              variant={ButtonVariants.Primary}
              label={loading ? "Saving..." : "Save"}
              icon={ArrowRightCircleIcon}
              isLink={false}
              loading={loading}
              onClick={onSubmit}
            />
          </div>
        </form>
      )}
      {!profile && <LoadingSpinner />}
    </AppLayout>
  );
}

export default function ProfilePage() {
  return <AuthWrapper toRender={PageContents} />;
}
