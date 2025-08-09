import { motion } from "framer-motion";

export default function PageTransitionAnimation() {
  return (
    <>
      {/* Primary transition layer */}
      <motion.div
        className="fixed bottom-0 right-full top-0 z-50 flex h-full w-screen items-center justify-center bg-gradient-to-r from-accent/90 to-accent"
        initial={{ x: "100%", width: "100%" }}
        animate={{ x: "0%", width: "0%" }}
        transition={{ 
          duration: 0.8, 
          ease: [0.76, 0, 0.24, 1] // Custom cubic-bezier for smooth easing
        }}
        exit={{ 
          x: ["0%", "100%"], 
          width: ["0%", "100%"],
          transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] }
        }}
      >
        <motion.div 
          className="h-24 w-24 sm:h-32 sm:w-32"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.2, 
            duration: 0.5, 
            ease: "easeOut",
            type: "spring",
            stiffness: 100,
            damping: 10
          }}
        >
          <motion.svg
            width="100%"
            height="100%"
            viewBox="0 0 10 10"
            className="fill-background drop-shadow-lg"
            xmlns="http://www.w3.org/2000/svg"
            animate={{ 
              filter: [
                "drop-shadow(0 0 0px rgba(255,255,255,0))",
                "drop-shadow(0 0 20px rgba(255,255,255,0.8))",
                "drop-shadow(0 0 0px rgba(255,255,255,0))"
              ]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
          >
            <path d="M3.78711 3.17969L5 0.841797L9.74609 10H7.22656L3.78711 3.17969ZM4.6543 6.29688L2.77344 10H0.253906L3.42969 3.87109L4.6543 6.29688Z" />
          </motion.svg>
        </motion.div>
      </motion.div>

      {/* Secondary transition layer with stagger effect */}
      <motion.div
        className="fixed bottom-0 right-full top-0 z-40 flex h-full w-screen items-center justify-center bg-gradient-to-l from-accent/70 to-accent/90 backdrop-blur-sm"
        initial={{ x: "100%", width: "100%" }}
        animate={{ x: "0%", width: "0%" }}
        transition={{ 
          delay: 0.15, 
          duration: 0.9, 
          ease: [0.76, 0, 0.24, 1]
        }}
        exit={{ 
          x: ["0%", "100%"], 
          width: ["0%", "100%"],
          transition: { 
            delay: 0.1,
            duration: 0.7, 
            ease: [0.76, 0, 0.24, 1] 
          }
        }}
      >
        <motion.div 
          className="h-16 w-16 sm:h-20 sm:w-20"
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            delay: 0.4, 
            duration: 0.4, 
            ease: "easeOut",
            type: "spring",
            stiffness: 120,
            damping: 12
          }}
        >
          <motion.svg
            width="100%"
            height="100%"
            viewBox="0 0 10 10"
            className="fill-background/80"
            xmlns="http://www.w3.org/2000/svg"
            animate={{ 
              opacity: [0.8, 1, 0.8],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
          >
            <path d="M3.78711 3.17969L5 0.841797L9.74609 10H7.22656L3.78711 3.17969ZM4.6543 6.29688L2.77344 10H0.253906L3.42969 3.87109L4.6543 6.29688Z" />
          </motion.svg>
        </motion.div>
      </motion.div>

      {/* Tertiary layer for extra depth */}
      <motion.div
        className="fixed bottom-0 right-full top-0 z-30 h-full w-screen bg-gradient-to-br from-accent/20 to-accent/40"
        initial={{ x: "100%", width: "100%" }}
        animate={{ x: "0%", width: "0%" }}
        transition={{ 
          delay: 0.3, 
          duration: 1.0, 
          ease: [0.76, 0, 0.24, 1]
        }}
        exit={{ 
          x: ["0%", "100%"], 
          width: ["0%", "100%"],
          transition: { 
            delay: 0.2,
            duration: 0.8, 
            ease: [0.76, 0, 0.24, 1] 
          }
        }}
      />
    </>
  );
}
