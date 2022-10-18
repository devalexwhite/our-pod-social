import { ArrowRightCircleIcon } from "@heroicons/react/20/solid";
import { useEffect, useRef, useState } from "react";
import { useFirestore, useStorage, useUser } from "reactfire";
import { updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import Logo from "../../components/Logo";
import Input from "../../components/Input/Input";
import Button, { ButtonVariants } from "../../components/Button/Button";
import { onChange } from "../../lib/FormHelpers";
import LoadingSpinner from "../../components/LoadingSpinner";
import ProfilePicture, {
  ProfilePictureSize,
} from "../../components/Profile/ProfilePicture";
import { getDownloadURL, uploadBytes } from "firebase/storage";
import { ref as sRef } from "firebase/storage";
import { useRouter } from "next/router";

const RenderForm = ({
  onSubmit,
  displayName,
  phoneNumber,
  photoURL,
  loading,
}) => {
  const [state, setState] = useState({ displayName, phoneNumber, photoURL });
  const fileRef = useRef(null);

  const onSubmitInter = (e) => {
    e.preventDefault();
    onSubmit(state);
  };

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

  return (
    <form className="mt-8 space-y-6 text-lg ">
      <div>
        <label
          htmlFor="photoURL"
          id="photoURL"
          className="block text-sm font-medium text-gray-700"
        >
          Help your friends find you with a profile pic:
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
        label="Enter your full name:"
        name="displayName"
        placeholder="Tom Baker"
        value={state.displayName}
        onChange={(e) => onChange(e, setState)}
      />
      <Input
        type="tel"
        label="Enter a phone number for friends to find you and reach out with (optional):"
        name="phoneNumber"
        placeholder="1234567890"
        value={state.phoneNumber}
        onChange={(e) => onChange(e, setState)}
      />
      <div className="max-w-xl mt-8 grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <Button
            variant={ButtonVariants.Secondary}
            label={"Go back"}
            isLink={true}
            href="/onboard/1"
          />
        </div>
        <div className="col-span-2">
          <Button
            variant={ButtonVariants.Primary}
            label={loading ? "Saving..." : "Continue"}
            icon={ArrowRightCircleIcon}
            isLink={false}
            loading={loading}
            onClick={onSubmitInter}
          />
        </div>
      </div>
    </form>
  );
};

export default function OnboardPage2() {
  const router = useRouter();
  const user = useUser();
  const firestore = useFirestore();
  const storage = useStorage();
  const [profile, setProfile] = useState();
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    if (!user?.data || !firestore) return;

    fetchUserProfile();
  }, [user, firestore]);

  const fetchUserProfile = async () => {
    const docData = await getDoc(doc(firestore, "users", user.data.uid));

    if (docData.exists()) setProfile(docData.data());
    else setProfile({ phoneNumber: "" });
  };

  const onSubmit = async ({ displayName, phoneNumber, file }) => {
    setLoadingSubmit(true);

    let photoURL = user.data.photoURL;

    try {
      if (file) {
        const storageRef = sRef(storage, `${user.data.uid}/${file.name}`);
        const uploadResult = await uploadBytes(storageRef, file);
        photoURL = await getDownloadURL(uploadResult.ref);
      }

      await updateProfile(user.data, {
        displayName,
        photoURL,
      });

      await setDoc(
        doc(firestore, "users", user.data.uid),
        {
          phoneNumber,
          displayName,
          uid: user.data.uid,
          photoURL,
          email: user.data.email,
        },
        { merge: true }
      );
      router.push("/onboard/3");
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-blue-50 px-8">
      <div className="max-w-xl pt-16 mx-auto">
        <Logo className="w-auto h-12" />
        <h1 className="mt-8 text-4xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
          Introduce yourself!
        </h1>
        {user?.data && profile && (
          <RenderForm
            phoneNumber={profile.phoneNumber}
            displayName={user.data.displayName}
            photoURL={user.data.photoURL}
            onSubmit={onSubmit}
            loading={loadingSubmit}
          />
        )}
        {(!user?.data || !profile) && <LoadingSpinner />}
      </div>
    </div>
  );
}
