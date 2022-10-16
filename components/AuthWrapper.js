import { useSigninCheck } from "reactfire";

export default function AuthWrapper() {
  const { status, data } = useSigninCheck();

  return <div></div>;
}
