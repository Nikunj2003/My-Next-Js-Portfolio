import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
// Animations removed (framer-motion dependency removed for this component)

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
  // Hover tracking state removed with animations

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
    <header
      className="sticky top-0 z-50 mt-2 px-6 py-8 sm:mt-8 sm:px-14 md:px-20"
    >
      <div className="mx-auto flex items-center justify-between lg:max-w-7xl">
        {/* Mobile Menu Logo for Small Screens */}
        <div className="md:hidden">
          <MenuLogo open={isModalOpen} toggle={toggleModal} />
        </div>

        {/* Navigation Links for Medium+ Screens */}
        <nav
          className="hidden flex-grow items-center justify-between gap-2 rounded-full px-2 py-2 shadow-lg ring-1 ring-zinc-200/80 backdrop-blur-xl dark:ring-accent/30 md:flex"
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
                <li
                  key={index}
                  className="relative"
                >
                  <Link
                    href={href}
                    className={classNames(
                      isActive
                        ? `font-semibold ${textColor} rounded-full bg-[#56A5A9] px-4 py-3 shadow-lg shadow-[#56A5A9]/30`
                        : "text-[#56A5A9] hover:text-[#4A9196]",
                      "relative mx-3 rounded-full px-4 py-3"
                    )}
                  >
                    {title}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Side: Theme Switch & Contact Button */}
          <div
            className="ml-auto flex items-center gap-4"
          >
            <div>
              <ThemeSwitch />
            </div>
            <div>
              <ContactButton />
            </div>
          </div>
        </nav>

        {/* Desktop Menu Logo */}
        <div
          className="hidden md:block"
        >
          <MenuLogo open={isModalOpen} toggle={toggleModal} />
        </div>
      </div>

      {isModalOpen && (
        <MobileMenu
          routes={routes}
          openMenu={isModalOpen}
          setOpenMenu={setIsModalOpen}
        />
      )}
    </header>
  );
}
