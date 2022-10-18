import { CheckIcon } from "@heroicons/react/20/solid";
import Head from "next/head";
import Button, { ButtonVariants } from "../components/Button/Button";
import Footer from "../components/Footer";
import Logo from "../components/Logo";

import styles from "../styles/Home.module.css";

export default function Home() {
  const features = [
    {
      name: "Simple",
      description: "Log your life with a single, daily text post.",
    },
    {
      name: "Your Pod",
      description:
        "A space with posts from only your closest friends and family.",
    },
    {
      name: "Freedom",
      description: "No dopamine hits trying to keep you scrolling.",
    },
    {
      name: "Reconnect",
      description: "We encourage you to call or email your PodMates.",
    },
    {
      name: "Safe",
      description:
        "Your data is yours, we won't sell or give out any information.",
    },
  ];

  return (
    <div>
      <Head>
        <title>OurPod: The social network for good</title>
        <meta
          name="description"
          content="A new type of social network focused on connecting you, not addicting you."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mt-32  ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-6xl w-full mx-auto px-6">
          <div className="">
            <Logo className="h-20 w-auto" />
            <h1 className="mt-8 text-4xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
              A new type of social network.
            </h1>
            <p className="mt-8 text-lg text-gray-500">
              OurPod is the social network focused on connecting you, not
              addicting you. We keep it simple.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-8">
              <Button label="Get Started" isLink={true} href="/enter" />
              <Button
                label="Login"
                isLink={true}
                variant={ButtonVariants.Secondary}
                href="/enter"
              />
            </div>
          </div>
          <img
            src="/screenshot.png"
            className="w-full h-auto rounded-lg shadow-lg border-2 border-gray-200"
          />
        </div>

        <div className="w-full bg-gray-800 px-6 py-8 mt-12">
          <div className="max-w-6xl w-full mx-auto px-6">
            <h3 className="mt-8 text-3xl font-bold leading-8 tracking-tight text-gray-200 sm:text-3xl">
              What makes OurPod different?
            </h3>
            <dl className="mt-8 pb-32  space-y-10 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:grid-cols-4 lg:gap-x-8">
              {features.map((feature) => (
                <div key={feature.name} className="relative">
                  <dt>
                    <CheckIcon
                      className="absolute h-6 w-6 text-green-500"
                      aria-hidden="true"
                    />
                    <p className="ml-9 text-lg font-medium leading-6 text-gray-200">
                      {feature.name}
                    </p>
                  </dt>
                  <dd className="mt-2 ml-9 text-base text-gray-100">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="relative max-w-6xl w-full mx-auto px-6">
          <img
            src="/screenshot-2.png"
            className="h-256 rounded-lg shadow-lg border-2 border-gray-200 mx-auto -mt-28 w-auto z-20 relative"
          />
          <div
            className={`absolute w-full h-[20rem] md:h-[40rem] opacity-50 top-40 z-10 ${styles["pattern-background"]}`}
          />
        </div>
        <div className="mt-16 max-w-6xl w-full mx-auto px-6 text-center">
          <h3 className="mt-8 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-3xl">
            Stop competing for internet points.
          </h3>
          <p className="mt-8 text-lg text-gray-500">
            Our writing experience focuses on your day, so you can share your
            journey with those who matter. From there, we invite you to connect
            with your PodMates offline.
          </p>
          <div className="mt-8 max-w-xs mx-auto">
            <Button label="Get Started" isLink={true} href="/enter" />
          </div>
        </div>
        <div className="mt-16">
          <Footer />
        </div>
      </main>
    </div>
  );
}
