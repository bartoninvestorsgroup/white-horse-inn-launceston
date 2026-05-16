"use client";

import { motion } from "framer-motion";
import FoodImageCard from "@/components/ui/FoodImageCard";

const foodCardVariants = {
  hidden: { opacity: 0, y: 48 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function HomeFoodShowcase({ cards }) {
  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-3">
      {cards.map((card, index) => (
        <motion.div
          key={card.src}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.28 }}
          variants={foodCardVariants}
          transition={{ delay: index * 0.12 }}
        >
          <FoodImageCard
            src={card.src}
            alt={card.alt}
            title={card.title}
            description={card.description}
            eyebrow={card.eyebrow}
            size={card.size}
            innerBorderTone={card.innerBorderTone}
            blurFrame
          />
        </motion.div>
      ))}
    </div>
  );
}
