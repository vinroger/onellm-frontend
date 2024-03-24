import React, { useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { Badge } from "@/components/ui/badge";

interface ListBoxProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  idKey: string;
  displayKey: string;
  label: string;
}

const ListBoxCustom: React.FC<ListBoxProps> = ({
  options,
  selected,
  onChange,
  idKey,
  displayKey,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const isSelected = (value: string) => selected.includes(value);

  const handleSelect = (value: string[]) => {
    onChange(value);
  };

  return (
    <Listbox
      as="div"
      className="space-y-1"
      value={selected}
      onChange={(value) => handleSelect(value)}
      multiple
    >
      {() => (
        <div className="relative z-50">
          <style>
            {`
          #listbox-container::-webkit-scrollbar-track {
            background-color: #f1f1f1;
            border-radius: 10px;
            display:none;
          }
          #listbox-container::-webkit-scrollbar-thumb {
            background-color: #a0a0a0;
            border-radius: 10px;
            border: 3px solid #f0f0f0;
            display:none;
          }
          #listbox-container::-webkit-scrollbar {
            width: 0px;
            height: 0px;
          }

        `}
          </style>
          <span className="inline-block w-full rounded-md shadow-sm">
            <Listbox.Button
              className="relative w-full py-2 pl-3 pr-10 text-left transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md cursor-default focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="block truncate">
                {selected.length < 1 ? (
                  `Select ${label}s`
                ) : (
                  <div
                    className="max-w-full space-x-1 overflow-scroll"
                    id="listbox-container"
                  >
                    {selected.map((selectedKey) => {
                      const selectedOption: any = options.find(
                        (option: any) => option[idKey as any] === selectedKey
                      );

                      return (
                        <Badge variant="secondary" key={selectedKey}>
                          {selectedOption
                            ? selectedOption[displayKey]
                            : "Unknown"}
                        </Badge>
                      );
                    })}
                  </div>
                )}
              </span>
              <span className="absolute inset-y-0 right-0 z-50 flex items-center pr-2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Listbox.Button>
          </span>

          <Transition
            unmount={false}
            show={isOpen}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            className="absolute w-full mt-1 bg-white rounded-md shadow-lg"
          >
            <Listbox.Options
              static
              className="py-1 overflow-auto text-base leading-6 rounded-md shadow-xs max-h-60 focus:outline-none sm:text-sm sm:leading-5"
            >
              {options.map((item: any) => {
                const person = item[idKey];
                const selectedOption = isSelected(person);
                return (
                  <Listbox.Option key={person} value={person}>
                    {({ active }) => (
                      <div
                        className={`${
                          active ? "text-white bg-blue-600" : "text-gray-900"
                        } cursor-default select-none relative py-2 pl-8 pr-4`}
                      >
                        <span
                          className={`${
                            selectedOption ? "font-semibold" : "font-normal"
                          } block truncate`}
                        >
                          {item[displayKey]}
                        </span>
                        {selectedOption && (
                          <span
                            className={`${
                              active ? "text-white" : "text-blue-600"
                            } absolute inset-y-0 left-0 flex items-center pl-1.5`}
                          >
                            <svg
                              className="w-5 h-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                        )}
                      </div>
                    )}
                  </Listbox.Option>
                );
              })}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
};

export default ListBoxCustom;
