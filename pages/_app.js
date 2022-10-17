import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  AuthProvider,
  FirestoreProvider,
  StorageProvider,
  useFirebaseApp,
} from "reactfire";
import { FirebaseAppProvider } from "reactfire";
import { firebaseConfig } from "../config/firebaseConfig";

import "../styles/globals.css";

function FireServices({ children }) {
  const firebaseApp = useFirebaseApp();

  const firestoreInstance = getFirestore(firebaseApp);
  const storageInstance = getStorage(firebaseApp);
  const auth = getAuth(firebaseApp);

  return (
    <AuthProvider sdk={auth}>
      <StorageProvider sdk={storageInstance}>
        <FirestoreProvider sdk={firestoreInstance}>
          {children}
        </FirestoreProvider>
      </StorageProvider>
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
