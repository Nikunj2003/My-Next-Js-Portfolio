import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAnimationGate } from "@/contexts/animation-gate";

import { ArrowTopRight } from "@/components/icons";
import type { ProjectShowcaseListItem } from "@/components/projects/project-showcase-list";
import FadeUp from "@/animation/fade-up";

interface ProjectShowcaseProps {
  projects: ProjectShowcaseListItem[];
}

export default function ProjectShowcase({ projects }: ProjectShowcaseProps) {
  const { animationsReady } = useAnimationGate();
  const containerVariants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.06, delayChildren: 0.06 },
    },
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeOut" },
    },
  } as const;

  return (
    <section className="overflow-hidden px-6 py-28 sm:px-14 md:px-24">
      <div className="relative mx-auto max-w-7xl">
        <div className="rounded-2xl border border-border bg-muted/20 p-6 shadow-lg ring-1 ring-zinc-200/50 backdrop-blur-lg dark:ring-accent/20 sm:p-8 md:p-12">
          <FadeUp duration={0.5} whileInView>
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-accent sm:text-4xl">
                My projects
              </h2>
              <Link
                href="/projects"
                className="group relative hidden max-w-max items-center gap-3 text-base font-semibold sm:flex sm:text-lg"
              >
                <span className="text-accent">See all</span>
                <ArrowTopRight className="h-6 w-6 rotate-45 text-accent transition-transform duration-300 group-hover:rotate-0 group-hover:scale-[1.1]" />
              </Link>
            </div>
          </FadeUp>

          {animationsReady ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {projects.map((proj, i) => (
                <Link key={proj.title} href={proj.href} className="group">
                  <motion.div
                    variants={cardVariants}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ y: -6 }}
                    className="relative h-full overflow-hidden rounded-xl border border-accent/20 bg-white/10 p-4 shadow-md backdrop-blur-lg transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 dark:bg-black/20"
                  >
                    {/* Decorative glow */}
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/20 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-60" />

                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-accent/10">
                      <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <Image
                        src={proj.image.LIGHT}
                        alt={`${proj.title} preview`}
                        width={640}
                        height={360}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] dark:hidden"
                        priority={false}
                        loading="lazy"
                      />
                      {proj.image.DARK && (
                        <Image
                          src={proj.image.DARK}
                          alt={`${proj.title} preview`}
                          width={640}
                          height={360}
                          className="hidden h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] dark:block"
                          priority={false}
                          loading="lazy"
                        />
                      )}
                    </div>

                    <div className="mt-4 flex items-start justify-between gap-4">
                      <h3 className="text-lg font-semibold text-accent sm:text-xl">
                        {proj.title}
                      </h3>
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-accent/20 bg-accent/10 text-accent transition-all duration-200 group-hover:bg-accent/20">
                        <ArrowTopRight className="h-5 w-5 -rotate-45 transition-all duration-200 group-hover:rotate-0" />
                      </span>
                    </div>

                    <motion.div
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, amount: 0.4 }}
                      variants={{
                        hidden: {},
                        show: { transition: { staggerChildren: 0.05 } },
                      }}
                      className="mt-3 flex flex-wrap gap-2"
                    >
                      {proj.tags.slice(0, 5).map((tag, idx) => (
                        <motion.span
                          key={`${proj.title}-tag-${idx}`}
                          variants={{
                            hidden: { opacity: 0, y: 6 },
                            show: { opacity: 1, y: 0 },
                          }}
                          className="rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent backdrop-blur-sm"
                        >
                          #{tag}
                        </motion.span>
                      ))}
                      {proj.tags.length > 5 && (
                        <motion.span
                          variants={{
                            hidden: { opacity: 0, y: 6 },
                            show: { opacity: 1, y: 0 },
                          }}
                          className="rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent/80 backdrop-blur-sm"
                        >
                          +{proj.tags.length - 5}
                        </motion.span>
                      )}
                    </motion.div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((proj) => (
                <Link key={proj.title} href={proj.href} className="group">
                  <div className="relative h-full overflow-hidden rounded-xl border border-accent/20 bg-white/10 p-4 shadow-md backdrop-blur-lg transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 dark:bg-black/20">
                    {/* Decorative glow */}
                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/20 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-60" />

                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-accent/10">
                      <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <Image
                        src={proj.image.LIGHT}
                        alt={`${proj.title} preview`}
                        width={640}
                        height={360}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] dark:hidden"
                        priority={false}
                        loading="lazy"
                      />
                      {proj.image.DARK && (
                        <Image
                          src={proj.image.DARK}
                          alt={`${proj.title} preview`}
                          width={640}
                          height={360}
                          className="hidden h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] dark:block"
                          priority={false}
                          loading="lazy"
                        />
                      )}
                    </div>

                    <div className="mt-4 flex items-start justify-between gap-4">
                      <h3 className="text-lg font-semibold text-accent sm:text-xl">
                        {proj.title}
                      </h3>
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-accent/20 bg-accent/10 text-accent transition-all duration-200 group-hover:bg-accent/20">
                        <ArrowTopRight className="h-5 w-5 -rotate-45 transition-all duration-200 group-hover:rotate-0" />
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {proj.tags.slice(0, 5).map((tag, idx) => (
                        <span
                          key={`${proj.title}-tag-${idx}`}
                          className="rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent backdrop-blur-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                      {proj.tags.length > 5 && (
                        <span className="rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent/80 backdrop-blur-sm">
                          +{proj.tags.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <FadeUp duration={0.45} delay={0.16} whileInView>
            <div className="mt-10 flex justify-center sm:hidden">
              <Link
                href="/projects"
                className="group relative flex max-w-max items-center gap-3 text-base font-semibold sm:text-lg"
              >
                <span className="text-accent">See all</span>
                <ArrowTopRight className="h-6 w-6 rotate-45 text-accent transition-transform duration-300 group-hover:rotate-0 group-hover:scale-[1.1]" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
