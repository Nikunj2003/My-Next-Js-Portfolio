import { useEffect, useRef, useState } from "react";
import FloatingMailButton, {
  floatingMailButtonoptions,
} from "@/components/contact-form/floating-mail-button";
import ContactFormModal from "@/components/contact-form/contact-form-modal";
import { useTheme } from "next-themes"; // Import useTheme

export default function ContactButton() {
  const refSendBtn = useRef<HTMLButtonElement>(null);

  const [isBtnVisible, setIsBtnVisible] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [mounted, setMounted] = useState(false); // For checking if the theme is mounted

  const { resolvedTheme } = useTheme(); // Get the current theme

  const observerCallback = (entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    setIsBtnVisible(!entry.isIntersecting);
  };

  useEffect(() => {
    setMounted(true); // Theme has been mounted
  }, []);

  useEffect(() => {
    const btn = refSendBtn.current;
    const observer = new IntersectionObserver(
      observerCallback,
      floatingMailButtonoptions
    );
    if (btn) observer.observe(btn);
    return () => {
      if (btn) observer.unobserve(btn);
    };
  }, [refSendBtn]);

  // Listen for global event to open contact modal programmatically (e.g., from AI chat)
  useEffect(() => {
    const handler = (e: Event) => {
      setIsOpenModal(true);
    };
    window.addEventListener("open-contact-modal", handler as EventListener);
    return () =>
      window.removeEventListener(
        "open-contact-modal",
        handler as EventListener
      );
  }, []);

  // Determine the button text color based on the theme
  const buttonTextColor =
    mounted && resolvedTheme === "dark" ? "text-black" : "text-white";

  return (
    <>
      {isBtnVisible && !isOpenModal && (
        <FloatingMailButton openModal={setIsOpenModal} />
      )}

      <button
        ref={refSendBtn}
        className={`relative mx-3 my-3 font-semibold transition-transform duration-100 hover:scale-[1.1] ${buttonTextColor} rounded-full bg-[#56A5A9] px-4 py-3 sm:px-3 sm:py-2`}
        onClick={() => setIsOpenModal(true)}
      >
        Contact Me
      </button>

      <ContactFormModal showModal={isOpenModal} setShowModal={setIsOpenModal} />
    </>
  );
}
