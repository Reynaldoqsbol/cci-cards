import React from "react";
import { motion } from "framer-motion";
import "./cci-flip-card.css";

const CCIFlipCard = () => {
  const [flip, setFlip] = React.useState(true);
  const duration = 0.4;
  return (
    <div className="">
      <motion.div
        style={{ width: "270px", height: "144px" }}
        transition={{ duration, ease: "linear" }}
        animate={{ rotateY: flip ? 0 : 180 }}
      >
        <motion.div
          transition={{ duration, ease: "linear" }}
          animate={{ rotateY: flip ? 0 : 180 }}
          className="base-card"
          onClick={() => setFlip((prevState) => !prevState)}
          style={{ perspective: 1000 }}
        >
          <motion.div
            transition={{ duration, ease: "linear" }}
            animate={{ rotateY: flip ? 0 : 180 }}
            className="front-card"
          >
            <h3>03</h3>
            <p>Octubre 2024</p>
            <div>
              <span>Fecha de Cierre: 19/09/2024</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ rotateY: 180 }}
            animate={{ rotateY: flip ? 180 : 0 }}
            transition={{ duration, ease: "linear" }}
            className="back-card"
          >
            Contraseña: 389dfiu
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};
export { CCIFlipCard };
