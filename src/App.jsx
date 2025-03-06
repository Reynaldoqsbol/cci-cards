import "./App.css";
import * as React from "react";

import ExcelLikeGrid from "./components/Grid";
import Box from "@mui/material/Box";

import Modal from "@mui/material/Modal";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const initialRows = [
  {
    id: 1,
    spread: "Spread",
    base: "-",
    clients: 1.5,
    mobile: 2.5,
    pinned: true,
  },
  { id: 2, spread: 40, base: 9.25, clients: 20, mobile: 30 },
  { id: 3, spread: 60, base: 9.5, clients: 30, mobile: 40 },
  { id: 4, spread: 70, base: 10, clients: 40, mobile: 50 },
];

function App() {
  const [rows, setRows] = React.useState(initialRows);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <div className="container">
      <ExcelLikeGrid initialRows={rows} editable={false} onEdit={handleOpen} />
      <Modal open={open}>
        <Box sx={style}>
          <ExcelLikeGrid
            onClose={handleClose}
            onSave={(data) => {
              setRows(data);
              console.log("new data", data);
              handleClose();
            }}
            initialRows={rows}
            editable={true}
          />
        </Box>
      </Modal>
    </div>
  );
}

export default App;
