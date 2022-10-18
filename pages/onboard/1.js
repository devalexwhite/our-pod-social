import Logo from "../../components/Logo";
import Button, { ButtonVariants } from "../../components/Button/Button";
import { ArrowRightCircleIcon } from "@heroicons/react/20/solid";

export default function OnboardPage1() {
  return (
    <div className="w-screen min-h-screen bg-blue-50 px-8">
      <div className="max-w-xl pt-16 mx-auto">
        <Logo className="w-auto h-12" />
        <h1 className="mt-8 text-4xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
          Welcome to OurPod!
        </h1>
        <p className="mt-8 text-lg text-gray-500">
          You've joined the only social network focused on improving your life.
          OurPod encourages you to connect with your family and friends, instead
          of addicting you to our platform.
        </p>
        <div className="max-w-lg mt-8">
          <Button
            variant={ButtonVariants.Primary}
            label={"Continue"}
            icon={ArrowRightCircleIcon}
            isLink={true}
            href="/onboard/2"
          />
        </div>
      </div>
    </div>
  );
}
