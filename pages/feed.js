import {
  useAuth,
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
} from "reactfire";

import StatusTextarea from "../components/Input/StatusTextarea";
import PodmateSelector from "../components/PodmateSelector";
import Logo from "../components/Logo";

import ProfilePicture, {
  ProfilePictureSize,
} from "../components/Profile/ProfilePicture";
import { useEffect, useState } from "react";
import AuthWrapper from "../components/AuthWrapper";
import { userAgent } from "next/server";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import moods from "../config/moods";
import Button, { ButtonVariants } from "../components/Button/Button";
import {
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserCircleIcon,
} from "@heroicons/react/20/solid";
import AppLayout from "../layouts/app";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";

function RenderPodmatePost({ profile, currentDate }) {
  const post = profile.posts[currentDate];

  const mood = moods.find((mood) => mood.value == post.mood);

  return (
    <div>
      <article className="w-full">
        <h3 className="mt-8 text-2xl font-medium text-gray-900">
          {`Today, ${profile.displayName} was feeling `}{" "}
          <div
            className={`${mood.bgColor} w-8 h-8 rounded-full inline-flex items-center justify-center`}
          >
            <mood.icon
              className={`${mood.iconColor} flex-shrink-0 h-5 w-5`}
              aria-hidden="true"
            />
          </div>
          {" and wrote:"}
        </h3>
        <p className="mt-8 text-lg text-gray-500">{post.text}</p>
        <div className="mt-6 pt-2 border-t border-gray-300 flex w-full flex-col md:flex-row gap-4">
          {profile.phoneNumber && (
            <Button
              href={`tel:${profile.phoneNumber}`}
              label={`Call ${profile.displayName}`}
              icon={PhoneIcon}
              variant={ButtonVariants.Text}
              isLink={true}
            />
          )}
          {profile.email && (
            <Button
              href={`mailto:${profile.email}`}
              label={`Email ${profile.displayName}`}
              icon={EnvelopeIcon}
              variant={ButtonVariants.Text}
              isLink={true}
            />
          )}
        </div>
      </article>
    </div>
  );
}

function PageContents({ user }) {
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();

  const { status: profileStatus, data: profile } = useFirestoreDocData(
    doc(firestore, "users", user.uid)
  );

  const [post, setPost] = useState({ text: "", mood: null });
  const [selectedPodmate, setSelectedPodmate] = useState(null);
  const [postedToday, setPostedToday] = useState(false);
  const [pendingInvites, setPendingInvites] = useState(0);

  const currentDate = new Date().toDateString();

  const onLogout = () => {
    signOut(auth);
  };

  useEffect(() => {
    if (profile && !profile?.completedOnboard) router.push("/onboard/1");
    if (profile?.posts && currentDate in profile.posts) {
      setPostedToday(true);
      setPost(profile.posts[currentDate]);
    }
    if (profile) {
      setInvitesCount(profile);
    }
  }, [profile]);

  const setInvitesCount = async (profile) => {
    const invitesCollection = collection(firestore, "invites");
    const invitesQuery = query(
      invitesCollection,
      where("to", "in", [user.email, profile.phoneNumber])
    );
    const invites = await getDocs(invitesQuery);
    setPendingInvites(invites.size);
  };

  const onPost = async () => {
    await setDoc(
      doc(firestore, "users", user.uid),
      {
        posts: {
          ...(profile?.posts ?? []),
          [currentDate]: post,
        },
      },
      { merge: true }
    );
  };

  return (
    <AppLayout>
      <>
        <div className=" mb-8">
          <div className="mt-2  w-full gap-2 justify-between grid grid-cols-1 md:grid-cols-3 ">
            <div className="order-2 md:order-1 md:pt-8 ">
              <Button
                href={"/profile"}
                label="Your profile"
                icon={Cog6ToothIcon}
                variant={ButtonVariants.Text}
                isLink={true}
              />
            </div>
            <div className="order-1 md:order-2 flex items-center flex-col space-y-2">
              <ProfilePicture
                size={ProfilePictureSize.xlarge}
                photoURL={user.photoURL}
              />
              <Button
                variant={ButtonVariants.Text}
                label="Log off"
                onClick={onLogout}
                icon={ArrowRightOnRectangleIcon}
              />
            </div>
            <div className="order-3 md:pt-8 ">
              <Button
                href={"/podmates"}
                label={`Podmates ${
                  pendingInvites > 0 ? `(${pendingInvites} invites)` : ""
                }`}
                icon={UserCircleIcon}
                variant={ButtonVariants.Text}
                isLink={true}
              />
            </div>
          </div>
        </div>
        <div>
          {!postedToday && (
            <StatusTextarea
              post={post}
              onChange={(e) => setPost(e)}
              onSubmit={onPost}
            />
          )}
          {postedToday && (
            <div className="h-32 w-full flex items-center justify-center bg-gray-100 rounded-lg">
              <h3 className="text-lg text-gray-600 text-center max-w-lg ">{`Great post today ${user.displayName}, come back tomorrow to post again!`}</h3>
            </div>
          )}
        </div>
        <div>
          {profile?.podmates?.length && (
            <div className="mt-16">
              <p className="text-center text-lg font-medium text-gray-700">
                Your Pod
              </p>
              <div className="mt-4">
                <PodmateSelector
                  podmates={profile.podmates}
                  value={selectedPodmate}
                  onChange={setSelectedPodmate}
                />
              </div>
            </div>
          )}
        </div>
        <div>
          {selectedPodmate &&
            selectedPodmate?.posts &&
            currentDate in selectedPodmate.posts && (
              <div className="-mt-6 p-6 w-full flex items-center justify-center bg-gray-100 rounded-lg">
                {RenderPodmatePost({ profile: selectedPodmate, currentDate })}
              </div>
            )}
          {selectedPodmate && !(currentDate in selectedPodmate?.posts ?? []) && (
            <div className="-mt-6 p-6 w-full flex flex-col items-center justify-center bg-gray-100 rounded-lg">
              <img src="/adventure.svg" className="h-32 mx-auto mt-16 w-auto" />
              <h3 className="mt-8 text-lg text-gray-500 text-center max-w-sm mx-auto">{`${selectedPodmate.displayName} hasn't posted today, check back later!`}</h3>
            </div>
          )}
          {profile?.podmates?.length && !selectedPodmate && (
            <div className="-mt-6 p-6 w-full flex items-center justify-center bg-gray-100 rounded-lg">
              <h3 className="mt-8 text-lg text-gray-600 text-center max-w-lg ">{`Select a PodMate to see what they posted today.`}</h3>
            </div>
          )}
        </div>
      </>
    </AppLayout>
  );
}

export default function FeedPage() {
  return <AuthWrapper toRender={PageContents} />;
}
