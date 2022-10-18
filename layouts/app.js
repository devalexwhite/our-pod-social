import Head from "next/head";
import Link from "next/link";
import Footer from "../components/Footer";
import Logo from "../components/Logo";

export default function AppLayout({ children }) {
  return (
    <>
      <Head>
        <title>OurPod: The social network for good</title>
        <meta
          name="description"
          content="A new type of social network focused on connecting you, not addicting you."
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
