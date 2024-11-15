import React from "react";
import { motion } from "framer-motion";
import "./cci-expandable-card.css";

const CCIExpandableCard = ({ activeColor = "#acd040" }) => {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div
      className="cci-expandable-card-container"
      onClick={() => setExpanded(!expanded)}
    >
      <motion.div
        className="hidden-card"
        animate={{ y: expanded ? 40 : 0 }}
        transition={{ type: "spring", stiffness: 250 }}
        style={{
          transform: expanded ? "translateY(0)" : "translateY(20px)",
          backgroundColor: activeColor,
        }}
      >
        <span>Contraseña: XCEWREx</span>
        <div>Descargar</div>
      </motion.div>
      <div className="cci-expandable-card">
        <h3>03</h3>
        <p>Octubre 2024</p>
        <div>
          <span>Fecha de Cierre: 19/09/2024</span>
        </div>
      </div>
    </div>
  );
};
export { CCIExpandableCard };
