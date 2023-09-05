import { auth } from "@/firebase/client";
import paths from "@/utils/paths";
import { fetchSignInMethodsForEmail, sendEmailVerification, signInWithEmailAndPassword, updatePassword } from "@firebase/auth";
import { onSnapshot } from "@firebase/firestore";

export function listenToAuthChanges(userCallback: any, loadingCallback: any, errorCallback: any) {
  return auth.onAuthStateChanged(
    (auth) => {
      if (auth) {
        userCallback({
          uid: auth.uid,
          metadata: auth.metadata,
          emailVerified: auth.emailVerified,
        });

        onSnapshot(paths.users.doc(auth.uid), (doc) => {
          const data = doc.data();

          userCallback({
            uid: auth.uid,
            metadata: auth.metadata,
            emailVerified: auth.emailVerified,
            ...data,
          });
        });

        loadingCallback(false);
        errorCallback(null);
      } else {
        userCallback(null);
        loadingCallback(false);
        errorCallback(null);
      }
    },
    (error) => errorCallback(error)
  );
}

export async function signOut() {
  await auth.signOut();
}

export async function loginWithEmail(data: any, successHandler: any, errorHandler: any) {
  const providers = await fetchSignInMethodsForEmail(auth, data.email);

  if (providers.length > 0) {
    if (!providers.includes("password")) {
      errorHandler({
        message: `You previously logged in with the following method: ${providers[0]}`,
      });
      return;
    }
  }

  signInWithEmailAndPassword(auth, data.email, data.password)
    .then(async function (creds) {
      successHandler(creds);
      return;
    })
    .catch(async function (error) {
      errorHandler(error);
      return;
    });
}

export async function verifyEmail() {
  await sendEmailVerification(auth.currentUser!);
}

export async function changePassword(password: string) {
  try {
    await updatePassword(auth.currentUser!, password);
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
}
