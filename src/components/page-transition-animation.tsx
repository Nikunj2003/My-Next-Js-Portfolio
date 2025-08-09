import { motion } from "framer-motion";

export default function PageTransitionAnimation() {
  return (
    <>
      {/* Primary liquid wave transition */}
      <motion.div
        className="fixed bottom-0 right-full top-0 z-50 h-full w-screen bg-gradient-to-br from-accent via-accent-light to-accent"
        initial={{ x: "100%", width: "100%" }}
        animate={{ x: "0%", width: "0%" }}
        transition={{ 
          duration: 1.2, 
          ease: [0.87, 0, 0.13, 1] // Custom easing for smooth liquid feel
        }}
        exit={{ 
          x: ["0%", "100%"], 
          width: ["0%", "100%"],
          transition: { duration: 0.8, ease: [0.87, 0, 0.13, 1] }
        }}
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 85% 100%, 0% 100%)"
        }}
      />

      {/* Secondary flowing transition */}
      <motion.div
        className="fixed bottom-0 right-full top-0 z-40 h-full w-screen bg-gradient-to-tr from-accent/80 via-accent-dark to-accent/60 backdrop-blur-sm"
        initial={{ x: "100%", width: "100%" }}
        animate={{ x: "0%", width: "0%" }}
        transition={{ 
          delay: 0.15, 
          duration: 1.4, 
          ease: [0.87, 0, 0.13, 1]
        }}
        exit={{ 
          x: ["0%", "100%"], 
          width: ["0%", "100%"],
          transition: { 
            delay: 0.1,
            duration: 1.0, 
            ease: [0.87, 0, 0.13, 1] 
          }
        }}
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 70% 100%, 0% 100%)"
        }}
      />

      {/* Tertiary subtle layer */}
      <motion.div
        className="fixed bottom-0 right-full top-0 z-30 h-full w-screen bg-gradient-to-tl from-accent/40 via-background/20 to-accent/30"
        initial={{ x: "100%", width: "100%" }}
        animate={{ x: "0%", width: "0%" }}
        transition={{ 
          delay: 0.3, 
          duration: 1.6, 
          ease: [0.87, 0, 0.13, 1]
        }}
        exit={{ 
          x: ["0%", "100%"], 
          width: ["0%", "100%"],
          transition: { 
            delay: 0.2,
            duration: 1.2, 
            ease: [0.87, 0, 0.13, 1] 
          }
        }}
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 90% 100%, 0% 100%)"
        }}
      />

      {/* Floating particles effect */}
      <motion.div
        className="fixed inset-0 z-45 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-background/60 rounded-full"
            style={{
              left: `${20 + i * 10}%`,
              top: `${30 + (i % 3) * 20}%`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </>
  );
}
