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
            viewBox="0 0 120 100"
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
            {/* Stylish NK Logo Design */}
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="1"/>
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.8"/>
              </linearGradient>
            </defs>

            {/* Background Circle */}
            <circle cx="60" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3"/>

            {/* Stylized N - with modern geometric design */}
            <g transform="translate(20, 25)">
              {/* N left vertical */}
              <rect x="0" y="0" width="6" height="50" rx="3"/>
              {/* N diagonal - curved connection */}
              <path d="M6 40 Q15 30 24 10 Q27 7 30 10 L30 15 Q25 25 18 35 Q12 45 6 50" />
              {/* N right vertical */}
              <rect x="24" y="0" width="6" height="50" rx="3"/>
            </g>

            {/* Stylized K - with intersecting design */}
            <g transform="translate(65, 25)">
              {/* K vertical */}
              <rect x="0" y="0" width="6" height="50" rx="3"/>
              {/* K upper arm - angled */}
              <path d="M6 20 L20 8 Q23 6 25 9 L22 12 L10 22 Q8 24 6 22" />
              {/* K lower arm - angled */}
              <path d="M6 30 L22 42 Q25 44 23 47 L20 45 L8 35 Q6 33 6 30" />
              {/* K center connector */}
              <circle cx="12" cy="25" r="3"/>
            </g>

            {/* Decorative elements */}
            <circle cx="25" cy="20" r="2" opacity="0.6"/>
            <circle cx="95" cy="30" r="1.5" opacity="0.4"/>
            <circle cx="30" cy="80" r="1" opacity="0.5"/>
            <circle cx="90" cy="75" r="1.5" opacity="0.3"/>
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
            viewBox="0 0 120 100"
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
            {/* Stylish NK Logo Design - Secondary */}
            <defs>
              <linearGradient id="logoGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.6"/>
              </linearGradient>
            </defs>

            {/* Background Circle */}
            <circle cx="60" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.2"/>

            {/* Simplified N */}
            <g transform="translate(25, 30)">
              <rect x="0" y="0" width="4" height="40" rx="2"/>
              <path d="M4 32 Q12 22 20 8 Q22 6 24 8 L24 12 Q20 20 14 28 Q8 36 4 40" />
              <rect x="20" y="0" width="4" height="40" rx="2"/>
            </g>

            {/* Simplified K */}
            <g transform="translate(70, 30)">
              <rect x="0" y="0" width="4" height="40" rx="2"/>
              <path d="M4 16 L16 6 Q18 5 19 7 L17 9 L7 17 Q5 19 4 17" />
              <path d="M4 24 L17 34 Q19 35 18 37 L16 36 L6 28 Q4 26 4 24" />
              <circle cx="10" cy="20" r="2"/>
            </g>

            {/* Minimal decorative dots */}
            <circle cx="30" cy="25" r="1" opacity="0.4"/>
            <circle cx="90" cy="35" r="1" opacity="0.3"/>
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
