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
            viewBox="0 0 200 140"
            className="fill-background drop-shadow-lg"
            xmlns="http://www.w3.org/2000/svg"
            animate={{
              filter: [
                "drop-shadow(0 0 0px rgba(255,255,255,0))",
                "drop-shadow(0 0 25px rgba(255,255,255,0.9))",
                "drop-shadow(0 0 0px rgba(255,255,255,0))"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <defs>
              <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="1"/>
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.9"/>
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.7"/>
              </linearGradient>
              <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.8"/>
              </linearGradient>
            </defs>

            {/* Outer hexagonal frame */}
            <polygon
              points="100,15 140,35 140,85 100,105 60,85 60,35"
              fill="none"
              stroke="url(#accentGradient)"
              strokeWidth="2"
              opacity="0.4"
            />

            {/* Inner tech frame */}
            <polygon
              points="100,25 130,40 130,80 100,95 70,80 70,40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.3"
            />

            {/* Modern N - Angular design */}
            <g fill="url(#primaryGradient)">
              {/* N left pillar */}
              <polygon points="45,40 55,40 55,100 45,100" />
              {/* N diagonal connector with tech cuts */}
              <polygon points="55,85 85,45 90,50 85,55 75,65 70,70 65,75 55,95" />
              {/* N right pillar */}
              <polygon points="85,40 95,40 95,100 85,100" />
              {/* Tech accent lines on N */}
              <rect x="47" y="45" width="6" height="2" opacity="0.6"/>
              <rect x="47" y="55" width="4" height="2" opacity="0.6"/>
              <rect x="87" y="75" width="6" height="2" opacity="0.6"/>
              <rect x="89" y="85" width="4" height="2" opacity="0.6"/>
            </g>

            {/* Modern K - Sleek angular design */}
            <g fill="url(#primaryGradient)">
              {/* K main pillar */}
              <polygon points="110,40 120,40 120,100 110,100" />
              {/* K upper arm - modern angle */}
              <polygon points="120,60 145,40 155,40 150,45 135,60 125,65" />
              {/* K lower arm - modern angle */}
              <polygon points="125,75 135,80 150,95 155,100 145,100 120,80" />
              {/* K junction element */}
              <circle cx="122" cy="70" r="4" opacity="0.8"/>
              {/* Tech accent lines on K */}
              <rect x="112" y="45" width="6" height="2" opacity="0.6"/>
              <rect x="112" y="55" width="4" height="2" opacity="0.6"/>
              <rect x="140" y="42" width="8" height="1" opacity="0.5"/>
              <rect x="140" y="97" width="8" height="1" opacity="0.5"/>
            </g>

            {/* Circuit-like connecting elements */}
            <g stroke="currentColor" fill="none" strokeWidth="1" opacity="0.4">
              <path d="M95 70 Q100 70 105 70" />
              <circle cx="100" cy="70" r="2" fill="currentColor" opacity="0.6"/>
            </g>

            {/* Floating tech elements */}
            <g fill="currentColor" opacity="0.3">
              <rect x="40" y="30" width="3" height="3" transform="rotate(45 41.5 31.5)"/>
              <rect x="157" y="35" width="2" height="2" transform="rotate(45 158 36)"/>
              <rect x="35" y="110" width="2" height="2" transform="rotate(45 36 111)"/>
              <rect x="160" y="105" width="3" height="3" transform="rotate(45 161.5 106.5)"/>
            </g>

            {/* Corner accent dots */}
            <circle cx="180" cy="30" r="1.5" fill="currentColor" opacity="0.4"/>
            <circle cx="20" cy="110" r="1.5" fill="currentColor" opacity="0.4"/>
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
            viewBox="0 0 160 120"
            className="fill-background/80"
            xmlns="http://www.w3.org/2000/svg"
            animate={{
              opacity: [0.6, 0.9, 0.6],
              scale: [1, 1.15, 1],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <defs>
              <linearGradient id="secondaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.7"/>
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.4"/>
              </linearGradient>
            </defs>

            {/* Simplified hexagon */}
            <polygon
              points="80,20 105,30 105,70 80,80 55,70 55,30"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              opacity="0.3"
            />

            {/* Minimalist N */}
            <g fill="url(#secondaryGradient)">
              <rect x="35" y="35" width="6" height="45" rx="1"/>
              <polygon points="41,70 55,40 60,43 46,73"/>
              <rect x="55" y="35" width="6" height="45" rx="1"/>
            </g>

            {/* Minimalist K */}
            <g fill="url(#secondaryGradient)">
              <rect x="85" y="35" width="6" height="45" rx="1"/>
              <polygon points="91,55 110,35 115,38 96,58"/>
              <polygon points="96,62 115,82 110,85 91,65"/>
              <circle cx="93" cy="60" r="2.5"/>
            </g>

            {/* Simple connecting line */}
            <line x1="61" y1="57" x2="85" y2="57" stroke="currentColor" strokeWidth="1" opacity="0.3"/>

            {/* Minimal accents */}
            <circle cx="25" cy="25" r="1" fill="currentColor" opacity="0.3"/>
            <circle cx="135" cy="30" r="1" fill="currentColor" opacity="0.3"/>
            <circle cx="30" cy="95" r="0.8" fill="currentColor" opacity="0.2"/>
            <circle cx="130" cy="90" r="0.8" fill="currentColor" opacity="0.2"/>
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
