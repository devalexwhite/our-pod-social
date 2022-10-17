import { ArrowRightCircleIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useUser } from "reactfire";
import Button, { ButtonVariants } from "../../components/Button/Button";
import Logo from "../../components/Logo";
import PodmateInviter from "../../components/PodmateInviter";

export default function OnboardPage3() {
  const user = useUser();

  return (
    <div className="w-screen min-h-screen bg-blue-50">
      <div className="max-w-xl pt-16 mx-auto">
        <Logo className="w-auto h-12" />
        <h1 className="mt-8 text-4xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
          Last step!
        </h1>
        <p className="mt-8 text-lg text-gray-500">
          Let's invite your family or close friends to your Pod.
        </p>
        {user?.data?.uid && (
          <div className="mt-8">
            <PodmateInviter user={user?.data} />
          </div>
        )}
        <div className="max-w-xl mt-16 grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <Button
              variant={ButtonVariants.Secondary}
              label={"Go back"}
              isLink={true}
              href="/onboard/2"
            />
          </div>
          <div className="col-span-2">
            <Button
              variant={ButtonVariants.Primary}
              label="Finish"
              icon={ArrowRightCircleIcon}
              isLink={true}
              href="/feed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
