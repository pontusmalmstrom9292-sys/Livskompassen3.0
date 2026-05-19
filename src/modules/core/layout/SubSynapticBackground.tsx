import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function SubSynapticBackground() {
  const [nodes, setNodes] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate random nodes for the network visualization
    const generatedNodes = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setNodes(generatedNodes);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-kompass-blue/20 via-kompass-dark to-kompass-dark"></div>
      
      {/* Floating synaps nodes */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute w-1 h-1 bg-kompass-gold rounded-full shadow-[0_0_8px_2px_var(--tw-shadow-color)] shadow-kompass-gold/40"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: node.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTU5IDB2NjBIMFYwaDU5em0tMSAxdjU4SDFWMWgzOHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] mix-blend-overlay"></div>
    </div>
  );
}
