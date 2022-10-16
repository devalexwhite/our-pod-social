import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { AuthProvider, FirestoreProvider, useFirebaseApp } from "reactfire";
import { FirebaseAppProvider } from "reactfire";
import { firebaseConfig } from "../config/firebaseConfig";

import "../styles/globals.css";

function FireServices({ children }) {
  const firebaseApp = useFirebaseApp();

  const firestoreInstance = getFirestore(useFirebaseApp());
  const auth = getAuth(firebaseApp);

  return (
    <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={firestoreInstance}>{children}</FirestoreProvider>
    </AuthProvider>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <FireServices>
        <Component {...pageProps} />
      </FireServices>
    </FirebaseAppProvider>
  );
}

export default MyApp;
