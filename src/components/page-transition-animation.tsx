import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function PageTransitionAnimation() {
  return (
    <>
      {/* Full screen overlay - covers entire viewport */}
      <motion.div
        className="fixed inset-0 z-[60] h-screen w-screen bg-gradient-to-br from-accent via-accent-light to-accent-dark flex items-center justify-center"
        initial={{ clipPath: "circle(0% at 50% 50%)" }}
        animate={{ clipPath: "circle(100% at 50% 50%)" }}
        exit={{ clipPath: "circle(0% at 50% 50%)" }}
        transition={{
          duration: 1.0,
          ease: [0.76, 0, 0.24, 1],
          clipPath: { duration: 1.2 }
        }}
      >
        {/* Central Star Logo */}
        <motion.div
          className="flex items-center justify-center"
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 180, opacity: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: [0.76, 0, 0.24, 1],
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
        >
          <motion.div
            className="p-6 rounded-full bg-background/20 backdrop-blur-xl border-2 border-background/30 shadow-2xl"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
              boxShadow: [
                "0 0 0px rgba(255,255,255,0)",
                "0 0 30px rgba(255,255,255,0.5)",
                "0 0 0px rgba(255,255,255,0)"
              ]
            }}
            transition={{
              rotate: { duration: 4, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, repeatType: "reverse" },
              boxShadow: { duration: 2, repeat: Infinity, repeatType: "reverse" }
            }}
          >
            <Sparkles className="w-12 h-12 text-background drop-shadow-lg" />
          </motion.div>
        </motion.div>

        {/* Radiating circles */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute border border-background/30 rounded-full"
              style={{
                width: `${120 + i * 60}px`,
                height: `${120 + i * 60}px`,
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.1, 0.3]
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        {/* Floating particles around the logo */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30) * (Math.PI / 180);
            const radius = 150;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-background/70 rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </motion.div>
      </motion.div>

      {/* Secondary overlay for smoother transition */}
      <motion.div
        className="fixed inset-0 z-[55] h-screen w-screen bg-gradient-to-tl from-accent/80 via-accent-dark/60 to-accent/40 backdrop-blur-sm"
        initial={{ clipPath: "circle(0% at 30% 70%)" }}
        animate={{ clipPath: "circle(120% at 30% 70%)" }}
        exit={{ clipPath: "circle(0% at 30% 70%)" }}
        transition={{
          delay: 0.1,
          duration: 1.1,
          ease: [0.76, 0, 0.24, 1]
        }}
      />

      {/* Tertiary overlay for depth */}
      <motion.div
        className="fixed inset-0 z-[50] h-screen w-screen bg-gradient-to-tr from-accent/40 via-background/20 to-accent-light/30"
        initial={{ clipPath: "circle(0% at 70% 30%)" }}
        animate={{ clipPath: "circle(130% at 70% 30%)" }}
        exit={{ clipPath: "circle(0% at 70% 30%)" }}
        transition={{
          delay: 0.2,
          duration: 1.2,
          ease: [0.76, 0, 0.24, 1]
        }}
      />
    </>
  );
}
