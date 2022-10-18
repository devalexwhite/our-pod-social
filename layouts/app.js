import Head from "next/head";
import Link from "next/link";
import Footer from "../components/Footer";
import Logo from "../components/Logo";

export default function AppLayout({ children }) {
  return (
    <>
      <Head>
        <title>OurPod: Social media for social good</title>
        <meta
          name="description"
          content="A new type of social network focused on connecting you, not addicting you."
        />
        <meta
          property="og:title"
          content="OurPod: Social media for social good"
        />
        <meta
          property="og:description"
          content="AA new type of social network focused on connecting you, not addicting you."
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
          content="OurPod: Social media for social good"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-w-3xl mx-auto px-8 py-16">
        <nav>
          <Link href="/">
            <a>
              <Logo className="mb-16 h-16 w-auto mx-auto" />
            </a>
          </Link>
        </nav>
        {children}
      </main>
      <Footer />
    </>
  );
}
