import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes"; // Import useTheme

import MenuLogo from "@/components/utility/menu-button";
import ThemeSwitch from "@/components/utility/theme-switch";
import MobileMenu from "@/components/utility/mobile-menu";
import { classNames } from "@/utility/classNames";

// Importing the ContactButton component
import ContactButton from "@/components/contact-form/contact-button";

export type NavbarRoute = {
  title: string;
  href: string;
};

export type NavbarRoutes = NavbarRoute[];

export interface NavbarProps {
  routes: NavbarRoutes;
}

export default function Navbar(props: NavbarProps) {
  const pathName = usePathname();
  const { resolvedTheme } = useTheme(); // Get the current theme
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  return (
    <header className="sticky top-0 z-50 mt-2 px-6 py-8 sm:mt-8 sm:px-14 md:px-20">
      <div className="mx-auto flex items-center justify-between lg:max-w-7xl">
        {/* Mobile Menu Logo on Left for Mobile View */}
        <div className="md:hidden">
          <MenuLogo open={isModalOpen} toggle={toggleModal} />
        </div>

        {/* Centered Navigation Links with Theme Switch on Right */}
        <nav className="hidden md:flex flex-grow items-center justify-between gap-2 rounded-full px-2 py-2 shadow-md ring-1 ring-zinc-200 backdrop-blur-md dark:ring-accent/50 relative">
          {/* Left Side - Navigation Links */}
          <ul className="flex gap-2 text-sm font-medium">
            {props.routes.map((_link, index) => {
              const isActive = pathName === _link.href;

              // Set text color based on the theme
              const textColor =
                resolvedTheme === "dark" ? "text-black" : "text-white";

              return (
                <li
                  key={index}
                  className="transition-transform duration-100 hover:scale-[1.1] relative"
                >
                  <Link
                    href={_link.href}
                    className={classNames(
                      isActive
                        ? `font-semibold ${textColor} bg-[#56A5A9] rounded-full px-4 py-3 sm:px-4 sm:py-3 transition-all duration-300 ease-in-out` // Active state with larger bubble size
                        : "text-[#56A5A9] transition-colors duration-300 ease-in-out", // Inactive state
                      "relative mx-3 rounded-full"
                    )}
                  >
                    {_link.title}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Side - Contact Button and Theme Switch */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Theme Switch */}
            <ThemeSwitch />
            {/* Contact Button */}
            <ContactButton />
          </div>
        </nav>

        {/* Centered MenuLogo for Desktop View */}
        <div className="hidden md:block">
          <MenuLogo open={isModalOpen} toggle={toggleModal} />
        </div>
      </div>

      <MobileMenu
        routes={props.routes}
        openMenu={isModalOpen}
        setOpenMenu={setIsModalOpen}
      />
    </header>
  );
}
