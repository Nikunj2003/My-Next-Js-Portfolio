import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";

import ThemeSwitch from "@/components/utility/theme-switch";
import { type NavbarProps } from "@/layout/navbar";
import { classNames } from "@/utility/classNames";
import ContactButton from "@/components/contact-form/contact-button";
import { useTheme } from "next-themes";

export interface MobileMenuProps extends NavbarProps {
  openMenu: boolean;
  setOpenMenu: Dispatch<SetStateAction<boolean>>;
}

export default function MobileMenu({
  openMenu,
  routes,
  setOpenMenu,
}: MobileMenuProps) {
  const pathName = usePathname();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure theme is mounted to avoid mismatches on first render
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent rendering before the theme is resolved
  if (!mounted) return null;

  // Define background color based on theme (dark/light)
  const backgroundColor =
    resolvedTheme === "dark"
      ? "bg-black/40 backdrop-blur-lg" // Dark theme background with blur
      : "bg-white/40 backdrop-blur-lg"; // Light theme background with blur

  const handleClick = (href: string) => {
    setOpenMenu(false);
    router.push(href);
  };

  return (
    <Transition show={openMenu} as={Fragment}>
      <Dialog as="div" className="z-50" onClose={setOpenMenu}>
        <div className="fixed inset-0 flex items-center justify-center">
          <Transition.Child
            as={Fragment}
            enter="ease-[cubic-bezier(0.23, 1, 0.32, 1)] duration-300"
            enterFrom="opacity-0 translate-y-full scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="ease-[cubic-bezier(0.23, 1, 0.32, 1)] duration-300"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-full scale-95"
          >
            <Dialog.Panel
              className={`pointer-events-none absolute flex h-full w-full flex-col items-center justify-center overflow-y-auto rounded-b-2xl border-2 border-accent/20 px-6 py-8 text-accent shadow-lg shadow-accent/10 ${backgroundColor}`}
              style={{ willChange: "transform, opacity" }}
            >
              <motion.div
                className="pointer-events-auto flex flex-col items-center gap-8 text-center"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
                  },
                }}
                initial="hidden"
                animate="show"
              >
                {routes.map((link, i) => (
                  <motion.button
                    key={i}
                    className="group relative py-2 text-3xl font-medium"
                    onClick={() => handleClick(link.href)}
                    variants={{
                      hidden: { opacity: 0, y: 14, scale: 0.98 },
                      show: { opacity: 1, y: 0, scale: 1 },
                    }}
                    transition={{ type: "spring", stiffness: 320, damping: 24 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <motion.span
                      className={classNames(
                        pathName === link.href ? "w-full" : "w-0",
                        "absolute -bottom-1 left-0 h-1 rounded-lg bg-accent transition-[width] duration-300 group-hover:w-full"
                      )}
                      layoutId="mobileActiveIndicator"
                    />
                    <span className="relative z-10">{link.title}</span>
                  </motion.button>
                ))}

                <motion.div
                  variants={{
                    hidden: { opacity: 0, scale: 0.96 },
                    show: { opacity: 1, scale: 1 },
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                    delay: 0.04,
                  }}
                >
                  <ThemeSwitch setClose={setOpenMenu} />
                </motion.div>

                <motion.div
                  className="mt-2"
                  variants={{
                    hidden: { opacity: 0, scale: 0.96 },
                    show: { opacity: 1, scale: 1 },
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                    delay: 0.08,
                  }}
                >
                  <ContactButton />
                </motion.div>
              </motion.div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
