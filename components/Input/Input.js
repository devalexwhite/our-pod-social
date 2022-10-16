import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

export default function Input({
  label,
  name,
  leadingIcon,
  placeholder,
  type = "text",
  errorText,
  value = "",
  onChange = () => {},
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        {leadingIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <leadingIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
          </div>
        )}
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className="block w-full pr-10 text-red-900 placeholder-red-300 border-red-300 rounded-md focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
          placeholder={placeholder}
        />
        {errorText && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ExclamationCircleIcon
              className="w-5 h-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {errorText && <p className="mt-2 text-sm text-red-600">{errorText}</p>}
    </div>
  );
}
