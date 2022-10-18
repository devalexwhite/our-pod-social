import { RocketLaunchIcon } from "@heroicons/react/20/solid";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth, useFirestore } from "reactfire";
import Button, { ButtonVariants } from "../components/Button/Button";
import Input from "../components/Input/Input";
import Logo from "../components/Logo";
import { onChange } from "../lib/FormHelpers";

export default function EnterPage() {
  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const firestore = useFirestore();
  const auth = useAuth();
  const router = useRouter();

  const onLogin = async () => {
    try {
      const authResult = await signInWithEmailAndPassword(
        auth,
        user.email,
        user.password
      );
      const profile = await getDoc(
        doc(firestore, "users", authResult.user.uid)
      );

      const profileData = profile.data();
      console.log(profileData);

      if (profileData?.completedOnboard) router.push("/feed");
      else router.push("/onboard/1");
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, user.email, user.password);
      await onLogin();
    } catch (e) {
      if (e.code == "auth/email-already-in-use") await onLogin();
      else console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>OurPod: The social network for good</title>
        <meta
          name="description"
          content="A new type of social network focused on connecting you, not addicting you."
        />
        <meta
          property="og:title"
          content="OurPod: The social network for good"
        />
        <meta
          property="og:description"
          content="A new type of social network focused on connecting you, not addicting you."
        />
        <meta
          property="og:image"
          content="https://ourpod.co/facebook-banner.png"
        />
        <meta
          name="twitter:card"
          content="https://ourpod.co/facebook-banner.png"
        />
        <meta
          name="twitter:title"
          content="OurPod: The social network for good"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex items-center justify-center min-h-full px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Link href="/">
              <a>
                <Logo className="w-auto h-12 mx-auto" alt="OurPod Logo" />
              </a>
            </Link>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-center text-gray-900">
              Sign in, or create a new account.
            </h2>
          </div>
          <form className="mt-8 space-y-6" action="#" method="POST">
            <div className="space-y-4">
              <div>
                <Input
                  label={"Email address"}
                  type="email"
                  placeholder={"thomas@tank.com"}
                  name="email"
                  onChange={(e) => onChange(e, setUser)}
                  value={user.email}
                />
              </div>

              <div>
                <Input
                  label={"Password"}
                  type="password"
                  placeholder={"**********"}
                  name="password"
                  onChange={(e) => onChange(e, setUser)}
                  value={user.password}
                />
              </div>

              <div>
                <Button
                  label={"Let's go!"}
                  icon={RocketLaunchIcon}
                  variant={ButtonVariants.Primary}
                  onClick={onSubmit}
                  loading={loading}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
