/* eslint-disable jsx-a11y/no-redundant-roles */
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import Dashboard from "./dashboard";

export default function Home() {
  const [open, setOpen] = useState(true);
  const bots = [
    {
      name: "ColaBot",
      imageUrl:
        "https://www.creativefabrica.com/wp-content/uploads/2021/07/05/Chatbot-Logo-Modern-bot-logo-Graphics-14298242-1.jpg",
    },
    {
        name: "Sagae President",
        imageUrl:
          "https://www.creativefabrica.com/wp-content/uploads/2021/07/05/Chatbot-Logo-Modern-bot-logo-Graphics-14298242-1.jpg",
      },
      {
        name: "Speech Text",
        imageUrl:
          "https://www.creativefabrica.com/wp-content/uploads/2021/07/05/Chatbot-Logo-Modern-bot-logo-Graphics-14298242-1.jpg",
      },{
        name: "Example Bot1",
        imageUrl:
          "https://www.creativefabrica.com/wp-content/uploads/2021/07/05/Chatbot-Logo-Modern-bot-logo-Graphics-14298242-1.jpg",
      },
  ];
  return (
    <div style={{backgroundColor: 'green'}}>
      <div className="main-content">
        <Dashboard />

      <div id="hamburger" onClick={() => setOpen(true)}>
        <div id="wrapper">
          <FontAwesomeIcon icon={faCode} />
        </div>
      </div>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-0 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-20">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                        <button
                          type="button"
                          className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => setOpen(false)}
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex h-full flex-col overflow-y-scroll py-6 shadow-xl chat-history">
                      <div className="px-4 sm:px-6">
                        <Dialog.Title className="text-base font-semibold leading-6 text-white-900">
                          ColaBot
                        </Dialog.Title>
                        <p>Impact Holding Company</p>
                      </div>
                      <div className="text-base font-semibold leading-6 text-white-900 px-4 sm:px-6 mt-5">
                          Bots
                        </div>
                      <div className="relative flex px-4 sm:px-6">
                        <ul role="list">
                          {bots.map((person) => (
                            <li
                            key={person.name}
                            className="flex items-center justify-between gap-x-6 py-2"
                          >
                            <div className="flex min-w-0 gap-x-4 items-center">
                              <img
                                className="h-12 w-12 flex-none rounded-full bg-gray-50"
                                src={person.imageUrl}
                                alt=""
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-semibold leading-6 text-white-900">
                                  {person.name}
                                </p>
                              </div>
                            </div>
                          </li>
                          
                          ))}
                        </ul>
                      </div>
                      <div  className="px-4 sm:px-6 mt-5">
                        <div className="text-base font-semibold leading-6 text-white-900">
                            Chat Histories
                        </div>
                        <p className="primary-color pt-5">Today</p>
                        <p className="pt-2">Example bot1</p>
                        <p className="pt-2">Example chat1</p>
                        <p className="primary-color pt-5">Yesterday</p>
                        <p className="pt-2">Example bot1</p>
                        <p className="pt-2">Example chat1</p>
                        <p className="primary-color pt-5">Previous 7 days</p>
                        <p className="pt-2">Example bot1</p>
                        <p className="pt-2">Example chat1</p>
                        <p className="primary-color pt-5">Previous oveer 30 days</p>
                        <p className="pt-2">Example bot1</p>
                        <p className="pt-2">Example chat1</p>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
