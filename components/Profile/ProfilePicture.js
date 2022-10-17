import Link from "next/link";

export const ProfilePictureSize = {
  small: "h-6 h-6  text-xs",
  medium: "h-10 h-10 text-medium",
  large: "h-14 w-14 text-xl",
  xlarge: "h-20 w-20 text-2xl",
};

export default function ProfilePicture({
  size = ProfilePictureSize.large,
  displayName,
  photoURL,
  isLoading,
  href,
  onClick,
}) {
  const Wrapper = ({ children }) => {
    return (
      <>
        {href && !onClick && (
          <Link href={href}>
            <a className="aspect-square transition-all rounded-full hover:ring-indigo-500 hover:outline-none hover:ring-2 hover:ring-offset-2">
              {children}
            </a>
          </Link>
        )}

        {onClick && !href && (
          <button
            className="aspect-square transition-all rounded-full hover:ring-indigo-500 hover:outline-none hover:ring-2 hover:ring-offset-2"
            onClick={onClick}
          >
            {children}
          </button>
        )}
        {!onClick && !href && <div>{children}</div>}
      </>
    );
  };

  const getInitials = () => {
    const words = displayName.split(" ");

    let initials = words.reduce((p, c) => p.concat([c[0].toUpperCase()]), []);
    const initialString =
      initials.length > 1
        ? initials[0] + initials[initials.length - 1]
        : initials[0];

    return initialString;
  };

  return (
    <Wrapper>
      {!isLoading && photoURL && (
        <img
          className={`aspect-square border-2 border-gray-400  inline-block rounded-full ${size}`}
          src={photoURL}
          alt="A portrait photo of the current user"
        />
      )}
      {isLoading && (
        <div
          className={`aspect-square border-2 border-gray-400  inline-block bg-gray-100 rounded-full ${size} animate-pulse`}
        />
      )}
      {!isLoading && displayName && !photoURL && (
        <span
          className={`aspect-square border-2 border-gray-400  inline-flex items-center justify-center bg-gray-500 rounded-full ${size}`}
        >
          <span className="font-medium leading-none text-white">
            {getInitials()}
          </span>
        </span>
      )}
      {!isLoading && !displayName && !photoURL && (
        <span
          className={`aspect-square border-2 border-gray-400  inline-block overflow-hidden bg-gray-100 rounded-full ${size}`}
        >
          <svg
            className="w-full h-full text-gray-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </span>
      )}
    </Wrapper>
  );
}
