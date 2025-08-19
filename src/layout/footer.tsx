import { GithubIcon, LinkedinIcon, MailIcon } from "@/components/icons";
import { siteMetadata } from "@/data/siteMetaData.mjs";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/resume", label: "Resume" },
  ];

  return (
    <footer className="w-full bg-transparent">
      {/* Main Footer Content */}
      <div className="rounded-t-2xl border-t border-border bg-muted/20 shadow-md ring-1 ring-zinc-200 backdrop-blur-lg dark:ring-accent/50">
        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-14 md:px-20">
          <div className="grid gap-12 md:grid-cols-3 lg:gap-16">
            {/* Brand Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-foreground">
                  {siteMetadata.author}
                </h3>
                <p className="mt-2 text-lg text-muted-foreground">
                  {siteMetadata.description}
                </p>
              </div>
              <div className="flex gap-4">
                <a
                  href={siteMetadata.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent transition-all duration-300 hover:scale-110 hover:bg-accent hover:text-accent-foreground hover:shadow-lg"
                  aria-label="GitHub Profile"
                >
                  <GithubIcon className="h-5 w-5" />
                </a>
                <a
                  href={siteMetadata.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent transition-all duration-300 hover:scale-110 hover:bg-accent hover:text-accent-foreground hover:shadow-lg"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedinIcon className="h-5 w-5" />
                </a>
                <a
                  href={`mailto:${siteMetadata.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent transition-all duration-300 hover:scale-110 hover:bg-accent hover:text-accent-foreground hover:shadow-lg"
                  aria-label="Email Contact"
                >
                  <MailIcon className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-foreground">
                Quick Links
              </h4>
              <nav className="flex flex-col space-y-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center text-muted-foreground transition-colors duration-200 hover:text-accent"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-foreground">
                Get in Touch
              </h4>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Email
                  </p>
                  <a
                    href={`mailto:${siteMetadata.email}`}
                    className="text-foreground transition-colors duration-200 hover:text-accent"
                  >
                    {siteMetadata.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    Website
                  </p>
                  <a
                    href={siteMetadata.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground transition-colors duration-200 hover:text-accent"
                  >
                    {siteMetadata.siteUrl.replace("https://", "")}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-center sm:flex-row sm:text-left">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {siteMetadata.author}. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Made with ❤️ using Next.js</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
