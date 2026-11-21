import { motion } from 'framer-motion';

const particles = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: (i % 7) * 1.3,
  dur: 10 + (i % 5) * 3,
  size: 1 + (i % 3),
}));

export default function MotionBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="grid-bg absolute inset-0" />
      <motion.div
        className="absolute left-1/2 top-[-20%] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-white/[0.07] blur-[120px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-[10%] top-[30%] h-72 w-72 rounded-full bg-zinc-400/10 blur-[100px]"
        animate={{ x: [0, 120, 0], y: [0, -60, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[8%] top-[45%] h-80 w-80 rounded-full bg-zinc-200/[0.06] blur-[110px]"
        animate={{ x: [0, -140, 0], y: [0, 80, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0 rounded-full bg-white"
          style={{ left: `${p.left}%`, width: p.size, height: p.size }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -900, opacity: [0, 0.8, 0] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
}
