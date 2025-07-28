import { motion, AnimatePresence } from "framer-motion";
import { Stars, Sparkles } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

// Celestial particle animation component
function CelestialParticles() {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);

  useEffect(() => {
    const newParticles = Array.from({length: 15}, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: 'var(--cosmic-gold)'
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            y: [-20, 20, -20]
          }}
          transition={{
            duration: 3,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

// Constellation overlay animation
function ConstellationOverlay() {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <div className="relative w-full h-full">
        {/* Constellation lines */}
        <svg className="absolute inset-0 w-full h-full" style={{opacity: 0.1}}>
          <motion.path
            d="M100,100 L200,150 L300,120 L400,200 L500,180"
            stroke="var(--cosmic-lavender)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <motion.path
            d="M150,300 L250,280 L350,320 L450,300"
            stroke="var(--cosmic-lavender)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, delay: 0.5, ease: "easeInOut" }}
          />
        </svg>
        
        {/* Floating stars */}
        <motion.div
          className="absolute top-20 left-20"
          animate={{
            y: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Stars className="w-4 h-4" style={{color: 'var(--cosmic-gold)'}} />
        </motion.div>
        
        <motion.div
          className="absolute top-40 right-32"
          animate={{
            y: [0, 10, 0],
            rotate: [0, -5, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <Sparkles className="w-3 h-3" style={{color: 'var(--cosmic-lavender)'}} />
        </motion.div>
        
        <motion.div
          className="absolute bottom-32 left-1/3"
          animate={{
            y: [0, -15, 0],
            x: [0, 5, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <Stars className="w-3 h-3" style={{color: 'var(--cosmic-purple)'}} />
        </motion.div>
      </div>
    </motion.div>
  );
}

// Main page transition component
export function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="relative min-h-screen">
      <ConstellationOverlay />
      <CelestialParticles />
      {children}
    </div>
  );
}

// Page-specific transition variants
export const pageTransitions = {
  landing: {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 1,
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      y: -30,
      transition: { duration: 0.5 }
    }
  },
  
  home: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 1.1,
      transition: { duration: 0.5 }
    }
  },

  chart: {
    initial: { opacity: 0, rotateY: -15 },
    animate: { 
      opacity: 1, 
      rotateY: 0,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      rotateY: 15,
      transition: { duration: 0.6 }
    }
  }
};

// Component animation variants for staggered children
export const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

// Floating element animation
export const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

// Shimmer loading animation
export const shimmerAnimation = {
  backgroundPosition: ['200% 0', '-200% 0'],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "linear"
  }
};