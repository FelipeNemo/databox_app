import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gift, X } from "lucide-react";

export default function RewardsModal({ reward, isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white rounded-2xl shadow-xl p-6 w-96 text-center relative"
            initial={{ scale: 0.7 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.7 }}
          >
            <button 
              onClick={onClose} 
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <Gift className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h2 className="text-lg font-bold mb-2">🎉 Você ganhou uma recompensa!</h2>

            <p className="text-gray-700 mb-4">
              Tipo: <span className="font-semibold">{reward.type}</span>
            </p>
            <p className="text-2xl font-bold text-indigo-600 mb-6">
              + {reward.amount}
            </p>

            <button 
              onClick={onClose} 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
            >
              Fechar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
