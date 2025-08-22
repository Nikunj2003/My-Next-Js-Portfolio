import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

import MenuLogo from "@/components/utility/menu-button";
import ThemeSwitch from "@/components/utility/theme-switch";
import MobileMenu from "@/components/utility/mobile-menu";
import { classNames } from "@/utility/classNames";
import ContactButton from "@/components/contact-form/contact-button";
import { useChatContext } from "@/contexts/chat-context";

export type NavbarRoute = {
  title: string;
  href: string;
};

export type NavbarRoutes = NavbarRoute[];

export interface NavbarProps {
  routes: NavbarRoutes;
}

export default function Navbar({ routes }: NavbarProps) {
  const pathName = usePathname();
  const { resolvedTheme } = useTheme();
  const { isExitingFullScreen } = useChatContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  useEffect(() => {
    setMounted(true);
  }, []);

  const textColor = useMemo(
    () => (resolvedTheme === "dark" ? "text-black" : "text-white"),
    [resolvedTheme]
  );

  if (!mounted) return null;

  return (
    <motion.header
      className="sticky top-0 z-50 mt-2 px-6 py-8 sm:mt-8 sm:px-14 md:px-20"
      initial={isExitingFullScreen ? { y: 0, opacity: 1 } : { y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={isExitingFullScreen ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
    >
      <div className="mx-auto flex items-center justify-between lg:max-w-7xl">
        {/* Mobile Menu Logo for Small Screens */}
        <motion.div
          className="md:hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MenuLogo open={isModalOpen} toggle={toggleModal} />
        </motion.div>

        {/* Navigation Links for Medium+ Screens */}
        <motion.nav
          className="hidden flex-grow items-center justify-between gap-2 rounded-full px-2 py-2 shadow-lg ring-1 ring-zinc-200/80 backdrop-blur-xl dark:ring-accent/30 md:flex"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background:
              resolvedTheme === "dark"
                ? "rgba(0, 0, 0, 0.3)"
                : "rgba(255, 255, 255, 0.3)",
          }}
        >
          <ul className="flex gap-2 text-sm font-medium">
            {routes.map(({ title, href }, index) => {
              const isActive = pathName === href;

              return (
                <motion.li
                  key={index}
                  className="relative"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={href}
                    className={classNames(
                      isActive
                        ? `font-semibold ${textColor} rounded-full bg-[#56A5A9] px-4 py-3 shadow-lg shadow-[#56A5A9]/30`
                        : "text-[#56A5A9] hover:text-[#4A9196]",
                      "relative mx-3 rounded-full px-4 py-3 transition-all duration-300 ease-in-out"
                    )}
                  >
                    {title}
                    {!isActive && (
                      <AnimatePresence>
                        {hoveredIndex === index && (
                          <motion.div
                            className="absolute inset-0 rounded-full bg-[#56A5A9]/10 backdrop-blur-sm"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </AnimatePresence>
                    )}
                  </Link>
                </motion.li>
              );
            })}
          </ul>

          {/* Right Side: Theme Switch & Contact Button */}
          <motion.div
            className="ml-auto flex items-center gap-4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <ThemeSwitch />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ContactButton />
            </motion.div>
          </motion.div>
        </motion.nav>

        {/* Desktop Menu Logo */}
        <motion.div
          className="hidden md:block"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <MenuLogo open={isModalOpen} toggle={toggleModal} />
        </motion.div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <MobileMenu
            routes={routes}
            openMenu={isModalOpen}
            setOpenMenu={setIsModalOpen}
          />
        )}
      </AnimatePresence>
    </motion.header>
  );
}
