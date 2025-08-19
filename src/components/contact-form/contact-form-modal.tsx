import { Dispatch, Fragment, SetStateAction } from "react";

import { Dialog, Transition } from "@headlessui/react";
import { MailIcon, XIcon } from "lucide-react";

import ContactForm from "@/components/contact-form/contact-form";

export interface ContactFormModelProps {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export default function ContactFormModal({
  showModal,
  setShowModal,
}: ContactFormModelProps) {
  return (
    <Transition show={showModal} as={Fragment}>
      <Dialog
        as="div"
        className="z-[999999]"
        onClose={() => setShowModal(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
        </Transition.Child>
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 top-full"
            enterTo="opacity-100 top-16"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 top-16"
            leaveTo="opacity-0 top-full"
          >
            <Dialog.Panel className="absolute m-4 w-[95%] max-w-xl overflow-y-auto rounded-3xl border border-border bg-background px-6 py-8 shadow-2xl md:px-10 md:py-12">
              <div className="flex items-center justify-between">
                <Dialog.Title className="flex items-center gap-2 text-2xl font-bold text-foreground sm:gap-3 md:text-3xl">
                  <div className="rounded-full bg-accent/10 p-2">
                    <MailIcon className="h-6 w-6 text-accent sm:h-7 sm:w-7" />
                  </div>
                  <span>Send Message</span>
                </Dialog.Title>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all duration-200 hover:scale-105 hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setShowModal(false)}
                  aria-label="Close modal"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <ContactForm />
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
