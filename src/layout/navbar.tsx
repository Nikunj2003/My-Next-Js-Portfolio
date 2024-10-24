import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

import MenuLogo from "@/components/utility/menu-button";
import ThemeSwitch from "@/components/utility/theme-switch";
import MobileMenu from "@/components/utility/mobile-menu";
import { classNames } from "@/utility/classNames";
import ContactButton from "@/components/contact-form/contact-button";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // Ensures theme is resolved

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  useEffect(() => {
    // Wait until the theme is mounted before rendering
    setMounted(true);
  }, []);

  const textColor = useMemo(
    () => (resolvedTheme === "dark" ? "text-black" : "text-white"),
    [resolvedTheme]
  );

  if (!mounted) return null; // Prevent rendering until theme is resolved

  return (
    <header className="sticky top-0 z-50 mt-2 px-6 py-8 sm:mt-8 sm:px-14 md:px-20">
      <div className="mx-auto flex items-center justify-between lg:max-w-7xl">
        {/* Mobile Menu Logo for Small Screens */}
        <div className="md:hidden">
          <MenuLogo open={isModalOpen} toggle={toggleModal} />
        </div>

        {/* Navigation Links for Medium+ Screens */}
        <nav className="hidden flex-grow items-center justify-between gap-2 rounded-full px-2 py-2 shadow-md ring-1 ring-zinc-200 backdrop-blur-md dark:ring-accent/50 md:flex">
          <ul className="flex gap-2 text-sm font-medium">
            {routes.map(({ title, href }, index) => {
              const isActive = pathName === href;

              return (
                <li
                  key={index}
                  className="relative transition-transform duration-100 hover:scale-[1.1]"
                >
                  <Link
                    href={href}
                    className={classNames(
                      isActive
                        ? `font-semibold ${textColor} rounded-full bg-[#56A5A9] px-4 py-3 transition-all duration-300 ease-in-out`
                        : "text-[#56A5A9] transition-colors duration-300 ease-in-out",
                      "relative mx-3 rounded-full"
                    )}
                  >
                    {title}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Side: Theme Switch & Contact Button */}
          <div className="ml-auto flex items-center gap-4">
            <ThemeSwitch />
            <ContactButton />
          </div>
        </nav>

        {/* Desktop Menu Logo */}
        <div className="hidden md:block">
          <MenuLogo open={isModalOpen} toggle={toggleModal} />
        </div>
      </div>

      <MobileMenu
        routes={routes}
        openMenu={isModalOpen}
        setOpenMenu={setIsModalOpen}
      />
    </header>
  );
}
