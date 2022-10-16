import { RocketLaunchIcon } from "@heroicons/react/20/solid";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAuth } from "reactfire";
import Button, { ButtonVariants } from "../components/Button/Button";
import Input from "../components/Input/Input";
import Logo from "../components/Logo";
import { onChange } from "../lib/FormHelpers";

export default function EnterPage() {
  const [user, setUser] = useState({ email: "", password: "" });
  const auth = useAuth();
  const router = useRouter();

  const onLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, user.email, user.password);
      router.push("/feed");
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, user.email, user.password);
      onLogin();
    } catch (e) {
      if (e.code == "auth/email-already-in-use") onLogin();
      else console.error(e);
    }
  };

  return (
    <>
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
            <p className="mt-2 text-sm text-center text-gray-600">
              Trouble?{" "}
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Reset your password.
              </a>
            </p>
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
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
