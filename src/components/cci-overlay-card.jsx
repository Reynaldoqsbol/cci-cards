import "./cci-overlay-card.css";
const CCIOverlayCard = ({ activeColor = "#acd040" }) => {
  return (
    <div class="card wallet">
      <div class="overlay" style={{ backgroundColor: activeColor }}></div>
      <div style={{ zIndex: 9999 }} className="card-content">
        <h3>03</h3>
        <p>Octubre 2024</p>
        <div>
          <span>Fecha de Cierre: 19/09/2024</span>
        </div>
        <div className="hidden-content">
          <div>Download</div>
          <span>Clave: XXDDSD</span>
        </div>
      </div>
    </div>
  );
};
export { CCIOverlayCard };
