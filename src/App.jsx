import "./App.css";
import { CCICard } from "./components/cci-card";
import { CCIExpandableCard } from "./components/cci-expandable-card";
import { CCIFlipCard } from "./components/cci-flip-card";
import { CCIOverlayCard } from "./components/cci-overlay-card";

function App() {
  return (
    <div className="container">
      <div className="cci-card-container">
        <CCICard />
        <CCICard />
      </div>
      <div className="cci-card-container">
        <CCIExpandableCard />
        <CCIExpandableCard />
      </div>
      <div className="cci-card-container">
        <CCIFlipCard />
        <CCIFlipCard />
      </div>
      <div className="cci-card-container">
        <CCIOverlayCard />
        <CCIOverlayCard />
      </div>
    </div>
  );
}

export default App;
