import Logo from "../../components/Logo";
import Button, { ButtonVariants } from "../../components/Button/Button";
import { ArrowRightCircleIcon } from "@heroicons/react/20/solid";

export default function OnboardPage() {
  return (
    <div className="w-screen min-h-screen bg-blue-50">
      <div className="max-w-xl pt-16 mx-auto">
        <Logo className="w-auto h-12" />
        <h1 className="mt-8 text-4xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
          Welcome to the social network that keeps you connected, not addicted.
        </h1>
        <p className="mt-8 text-lg text-gray-500">
          With OurPod, you only see updates once a day from the top 10 people
          that matter most to you.
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
