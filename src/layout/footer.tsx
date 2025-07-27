import { GithubIcon, LinkedinIcon, MailIcon } from "@/components/icons";
import { siteMetadata } from "@/data/siteMetaData.mjs";

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
      {/* Contact CTA Section */}
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-14 md:px-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent to-accent/80 p-6 text-background sm:p-8 lg:p-12">
          <div className="relative z-10">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-background/10 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-background backdrop-blur-sm md:text-base">
                <MailIcon className="h-4 w-4" />
                Let's Connect
              </span>
            </div>
            <h2 className="mt-8 text-center text-3xl font-bold sm:text-5xl lg:text-6xl xl:text-7xl">
              Ready to work together?
            </h2>
            <div className="mt-8 flex flex-col items-center gap-6">
              <a
                href={`mailto:${siteMetadata.email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-2xl bg-background px-8 py-4 text-xl font-semibold text-accent transition-all duration-300 hover:scale-105 hover:shadow-xl sm:text-2xl"
              >
                <MailIcon className="h-6 w-6 transition-transform group-hover:scale-110" />
                Send me an email
              </a>
              <p className="text-center text-lg opacity-90 sm:text-xl">
                {siteMetadata.email}
              </p>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-background/10 blur-xl" />
          <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-background/5 blur-2xl" />
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="border-t border-border bg-muted/20">
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
                  className="group flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:scale-110 hover:shadow-lg"
                  aria-label="GitHub Profile"
                >
                  <GithubIcon className="h-5 w-5" />
                </a>
                <a
                  href={siteMetadata.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:scale-110 hover:shadow-lg"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedinIcon className="h-5 w-5" />
                </a>
                <a
                  href={`mailto:${siteMetadata.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:scale-110 hover:shadow-lg"
                  aria-label="Email Contact"
                >
                  <MailIcon className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-foreground">Quick Links</h4>
              <nav className="flex flex-col space-y-3">
                {quickLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center text-muted-foreground transition-colors duration-200 hover:text-accent"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-foreground">Get in Touch</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
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
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Website
                  </p>
                  <a
                    href={siteMetadata.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground transition-colors duration-200 hover:text-accent"
                  >
                    {siteMetadata.siteUrl.replace('https://', '')}
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
