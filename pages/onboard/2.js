import { ArrowRightCircleIcon } from "@heroicons/react/20/solid";

import Logo from "../../components/Logo";
import Input from "../../components/Input/Input";
import Button, { ButtonVariants } from "../../components/Button/Button";
import { useEffect, useState } from "react";
import { onChange } from "../../lib/FormHelpers";
import { useUser } from "reactfire";
import { updateProfile } from "firebase/auth";

export default function OnboardPage() {
  const user = useUser();

  const [profile, setProfile] = useState({
    name: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.data) {
      const { displayName, phoneNumber } = user.data;
      setProfile((prev) => ({
        ...prev,
        name: displayName,
      }));
    }
  }, [user]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await updateProfile(user.data, {
      displayName: profile.name,
      phoneNumber: profile.phone
        .replace(" ", "")
        .replace("-", "")
        .replace("(", "")
        .replace(")", ""),
    });
    setLoading(false);
  };

  return (
    <div className="w-screen min-h-screen bg-blue-50">
      <div className="max-w-xl pt-16 mx-auto">
        <Logo className="w-auto h-12" />
        <h1 className="mt-8 text-4xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
          Introduce yourself!
        </h1>
        <form className="mt-8 space-y-6 text-lg">
          <Input
            type="text"
            label="What name should your friends see?"
            name="name"
            placeholder="Tom Baker"
            value={profile.name}
            onChange={(e) => onChange(e, setProfile)}
          />
          <Input
            type="tel"
            label="Enter a phone number for friends to find you and reach out with (optional)"
            name="phone"
            placeholder="(123) 456-7890"
            value={profile.phone}
            onChange={(e) => onChange(e, setProfile)}
          />
        </form>
        <div className="max-w-xl mt-8">
          <Button
            variant={ButtonVariants.Primary}
            label={loading ? "Saving..." : "Continue"}
            icon={ArrowRightCircleIcon}
            isLink={false}
            loading={loading}
            onClick={onSubmit}
          />
        </div>
      </div>
    </div>
  );
}
