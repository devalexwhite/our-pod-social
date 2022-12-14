import React, { Fragment, useEffect, useState } from "react";
import { FaceSmileIcon } from "@heroicons/react/20/solid";
import { Listbox, Transition } from "@headlessui/react";
import Button from "../Button/Button";
import moods from "../../config/moods";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function StatusTextarea({ post, onChange, onSubmit }) {
  const [loading, setLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState(moods[moods.length - 1]);

  const onSubmitInner = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit();
    setLoading(false);
  };

  useEffect(() => {
    if (post?.mood) {
      setSelectedMood(moods.find((mood) => mood.value == post.mood ?? null));
    } else setSelectedMood(moods[moods.length - 1]);
  }, [post]);

  return (
    <div className="flex items-start space-x-4">
      <div className="min-w-0 flex-1">
        <form action="#" className="relative">
          <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
            <label htmlFor="comment" className="sr-only">
              What would you like to share about today with your PodMates?
            </label>
            <textarea
              rows={3}
              name="comment"
              id="comment"
              className="block w-full resize-none border-0 py-3 focus:ring-0 sm:text-sm"
              placeholder="What would you like to share about today with your PodMates?"
              value={post.text}
              onChange={(e) => onChange({ ...post, text: e.target.value })}
              disabled={loading}
            />

            {/* Spacer element to match the height of the toolbar */}
            <div className="py-2" aria-hidden="true">
              {/* Matches height of button in toolbar (1px border + 36px content height) */}
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
            <div className="flex items-center space-x-5">
              <div className="flex items-center">
                <Listbox
                  value={selectedMood}
                  onChange={(e) => onChange({ ...post, mood: e.value })}
                >
                  {({ open }) => (
                    <>
                      <Listbox.Label className="sr-only">
                        {" "}
                        Your mood{" "}
                      </Listbox.Label>
                      <div className="relative">
                        <Listbox.Button className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
                          <span className="flex items-center justify-center">
                            {selectedMood.value == null ? (
                              <span>
                                <FaceSmileIcon
                                  className="h-5 w-5 flex-shrink-0"
                                  aria-hidden="true"
                                />
                                <span className="sr-only"> Add your mood </span>
                              </span>
                            ) : (
                              <span>
                                <span
                                  className={classNames(
                                    selectedMood.bgColor,
                                    "flex h-8 w-8 items-center justify-center rounded-full"
                                  )}
                                >
                                  <selectedMood.icon
                                    className="h-5 w-5 flex-shrink-0 text-white"
                                    aria-hidden="true"
                                  />
                                </span>
                                <span className="sr-only">
                                  {selectedMood.name}
                                </span>
                              </span>
                            )}
                          </span>
                        </Listbox.Button>

                        <Transition
                          show={open}
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute z-10 mt-1 -ml-6 w-60 rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:ml-auto sm:w-64 sm:text-sm">
                            {moods.map((mood) => (
                              <Listbox.Option
                                key={mood.value}
                                className={({ active }) =>
                                  classNames(
                                    active ? "bg-gray-100" : "bg-white",
                                    "relative cursor-default select-none py-2 px-3"
                                  )
                                }
                                value={mood}
                              >
                                <div className="flex items-center">
                                  <div
                                    className={classNames(
                                      mood.bgColor,
                                      "w-8 h-8 rounded-full flex items-center justify-center"
                                    )}
                                  >
                                    <mood.icon
                                      className={classNames(
                                        mood.iconColor,
                                        "flex-shrink-0 h-5 w-5"
                                      )}
                                      aria-hidden="true"
                                    />
                                  </div>
                                  <span className="ml-3 block truncate font-medium">
                                    {mood.name}
                                  </span>
                                </div>
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </>
                  )}
                </Listbox>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button
                label={loading ? "Sharing..." : "Share"}
                loading={loading}
                onClick={onSubmitInner}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
