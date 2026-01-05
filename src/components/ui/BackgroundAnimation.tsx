import { motion } from 'framer-motion';

export function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Floating orbs */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full opacity-20 blur-3xl"
          style={{
            width: `${150 + i * 50}px`,
            height: `${150 + i * 50}px`,
            background: `radial-gradient(circle, hsl(var(--primary) / 0.3), transparent)`,
            left: `${10 + i * 20}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Coral accent orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`coral-${i}`}
          className="absolute rounded-full opacity-15 blur-3xl"
          style={{
            width: `${100 + i * 40}px`,
            height: `${100 + i * 40}px`,
            background: `radial-gradient(circle, hsl(var(--coral) / 0.3), transparent)`,
            right: `${5 + i * 15}%`,
            bottom: `${10 + i * 20}%`,
          }}
          animate={{
            x: [0, -25, 15, 0],
            y: [0, 30, -20, 0],
            scale: [1, 0.9, 1.05, 1],
          }}
          transition={{
            duration: 18 + i * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}

      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Gradient overlay at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
