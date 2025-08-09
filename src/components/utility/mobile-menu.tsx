import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
      ? "bg-black/60 backdrop-blur-2xl" // Dark theme background with blur
      : "bg-white/60 backdrop-blur-2xl"; // Light theme background with blur

  const handleClick = (href: string) => {
    setOpenMenu(false);
    router.push(href);
  };

  return (
    <AnimatePresence>
      {openMenu && (
        <Transition show={openMenu} as={Fragment}>
          <Dialog as="div" className="z-50" onClose={setOpenMenu}>
            <motion.div 
              className="fixed inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-500"
                enterFrom="opacity-0 translate-y-full scale-90"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="ease-in duration-400"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-full scale-90"
              >
                <Dialog.Panel
                  className={`pointer-events-none absolute flex h-full w-full flex-col items-center justify-center overflow-y-auto rounded-b-3xl border-2 border-accent/30 px-6 py-8 text-accent shadow-2xl shadow-accent/20 ${backgroundColor}`}
                  style={{ willChange: "transform, opacity" }}
                >
                  <motion.div 
                    className="pointer-events-auto flex flex-col items-center gap-8 text-center"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5, staggerChildren: 0.1 }}
                  >
                    {routes.map((link, i) => (
                      <motion.button
                        key={i}
                        className="group relative py-3 text-4xl font-medium transition-all duration-300 hover:scale-105"
                        onClick={() => handleClick(link.href)}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i + 0.3, duration: 0.4 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.span
                          className={classNames(
                            pathName === link.href ? "w-full opacity-100" : "w-0 opacity-0",
                            "absolute -bottom-2 left-0 h-1 rounded-lg bg-accent transition-all duration-300 group-hover:w-full group-hover:opacity-100"
                          )}
                          layoutId="mobileActiveIndicator"
                        />
                        <motion.span
                          className="relative z-10"
                          animate={pathName === link.href ? {
                            textShadow: "0 0 20px rgba(86, 165, 169, 0.5)"
                          } : {}}
                        >
                          {link.title}
                        </motion.span>
                      </motion.button>
                    ))}

                    {/* Add the ThemeSwitch */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                    >
                      <ThemeSwitch setClose={setOpenMenu} />
                    </motion.div>

                    {/* Add the ContactButton with increased size */}
                    <motion.div 
                      className="mt-4"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7, duration: 0.4 }}
                    >
                      <ContactButton />
                    </motion.div>
                  </motion.div>
                </Dialog.Panel>
              </Transition.Child>
            </motion.div>
          </Dialog>
        </Transition>
      )}
    </AnimatePresence>
  );
}
