import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";

export default function WelcomeScreen({
  onFinished,
}: {
  onFinished?: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentText, setCurrentText] = useState(0);

  const welcomeTexts = [
    "Welcome to my digital space",
    "Where innovation meets creativity",
    "Let's build something amazing together",
  ];

  useEffect(() => {
    // Always show welcome screen for now (for testing - can be changed later)
    // const hasVisited = localStorage.getItem("hasVisitedPortfolio");

    // if (!hasVisited) {
    setIsVisible(true);
    //   localStorage.setItem("hasVisitedPortfolio", "true");
    // }
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    // Disable background scroll
    const prevBodyOverflow = document.body.style.overflow;
    const prevDocOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    let touchStartY = 0;

    const onWheel = (e: WheelEvent) => {
      // Prevent page scroll while welcome screen is visible
      e.preventDefault();
      if (e.deltaY > 10) {
        handleClose();
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      // Prevent page scroll while welcome screen is visible
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      if (touchStartY - currentY > 20) {
        handleClose();
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel as any);
      window.removeEventListener("touchstart", onTouchStart as any);
      window.removeEventListener("touchmove", onTouchMove as any);
      // Restore background scroll
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevDocOverflow;
    };
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setCurrentText((prev) => (prev + 1) % welcomeTexts.length);
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [isVisible, welcomeTexts.length]);

  const handleClose = () => {
    // Mark that we are suppressing background scroll even after overlay unmounts
    if (typeof document !== "undefined") {
      (document.documentElement as any).dataset.scrollLock = "true";
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    }

    // Dismiss overlay
    setIsVisible(false);
    localStorage.setItem("hasVisitedPortfolio", "true");

    // Reset scroll to top
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }

    // Temporarily prevent wheel/touch scroll bleeding-through for a short time
    const prevent = (e: any) => {
      try {
        e.preventDefault();
        e.stopPropagation();
      } catch {}
    };
    window.addEventListener("wheel", prevent, { passive: false });
    window.addEventListener("touchmove", prevent, { passive: false });

    // Release lock shortly after to avoid momentum scroll
    setTimeout(() => {
      window.removeEventListener("wheel", prevent as any);
      window.removeEventListener("touchmove", prevent as any);
      if (typeof document !== "undefined") {
        try {
          delete (document.documentElement as any).dataset.scrollLock;
        } catch {}
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      }
    }, 350);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.3,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  const itemVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <AnimatePresence onExitComplete={() => onFinished?.()}>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-accent/10 backdrop-blur-xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
            <div className="bg-accent-light/15 absolute -bottom-40 -left-40 h-96 w-96 rounded-full blur-3xl" />

            {/* Floating elements */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-accent/30"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="relative z-10 mx-auto max-w-4xl px-8 text-center">
            {/* Sparkle Icon */}
            <motion.div
              variants={itemVariants}
              className="mb-8 flex justify-center"
            >
              <motion.div
                className="rounded-full border border-accent/30 bg-accent/20 p-4 backdrop-blur-lg"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                  scale: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  },
                }}
              >
                <Sparkles className="h-8 w-8 text-accent" />
              </motion.div>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              variants={itemVariants}
              className="mb-6 bg-gradient-to-r from-accent via-accent-light to-accent bg-clip-text text-5xl font-bold text-transparent md:text-7xl"
            >
              Nikunj Khitha
            </motion.h1>

            {/* Subtitle */}
            <motion.div
              variants={itemVariants}
              className="mb-12 text-xl font-medium text-muted-foreground md:text-2xl"
            >
              <span className="text-foreground">Software Engineer</span>
              <span className="mx-3 text-accent">•</span>
              <span className="text-foreground">AI Enthusiast</span>
              <span className="mx-3 text-accent">•</span>
              <span className="text-foreground">Full Stack Developer</span>
            </motion.div>

            {/* Dynamic Welcome Text */}
            <motion.div
              variants={itemVariants}
              className="mb-12 flex h-16 items-center justify-center"
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentText}
                  variants={textVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-lg font-medium text-foreground/80 md:text-xl"
                >
                  {welcomeTexts[currentText]}
                </motion.p>
              </AnimatePresence>
            </motion.div>

            {/* Enter Button */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center space-y-6"
            >
              <motion.button
                onClick={handleClose}
                className="group relative overflow-hidden rounded-full bg-accent px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-accent-light to-accent-dark"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">Enter Portfolio</span>
              </motion.button>

              {/* Scroll Indicator */}
              <motion.div
                className="flex flex-col items-center text-muted-foreground"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="mb-2 text-sm">Scroll to explore</span>
                <ChevronDown className="h-5 w-5" />
              </motion.div>
            </motion.div>
          </div>

          {/* Skip Button */}
          <motion.button
            onClick={handleClose}
            className="absolute right-8 top-8 text-muted-foreground transition-colors duration-300 hover:text-foreground"
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          ></motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
