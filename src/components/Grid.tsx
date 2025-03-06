import * as React from "react";
import { Button, IconButton, Stack, styled } from "@mui/material";
import Papa from "papaparse";
import {
  DataGridPro,
  GridColDef,
  GridColumnGroupingModel,
  GridRowsProp,
} from "@mui/x-data-grid-pro";
import DeleteIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function ExcelLikeGrid({
  editable,
  initialRows,
  onEdit,
  onSave,
  onClose,
}: {
  editable: boolean;
  initialRows: GridRowsProp;
  onEdit?: () => void;
  onSave?: (data: any) => void;
  onClose?: () => void;
}) {
  const [rows, setRows] = React.useState([...initialRows]);
  //@todo: CHECK if there is another way to update rows when initialRows changes
  React.useEffect(() => {
    setRows([...initialRows]);
  }, [initialRows]);

  const gridRef = React.useRef<HTMLDivElement>(null);

  const maxVal = 100;
  const minVal = 0;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (result: any) => {
        const data = result.data as any[];

        if (data.length === 0) return;

        const maxId = rows.length ? Math.max(...rows.map((row) => row.id)) : 0;
        const newRows = data.map((row, index) => ({
          ...row,
          id: maxId + index + 1,
        }));

        setRows((prevRows) => [...prevRows, ...newRows]); // Append new rows
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
      type: "number",
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "spread",
      headerName: "Plazo",
      width: 70,
      type: "number",
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      cellClassName: (params) => {
        const hasRepeatedSpread = rows.some(
          (row) =>
            row.spread === Number(params.value) && row.id !== params.row.id
        );
        //INFO : DOESNT WORTK WHEN LOADS DATA
        return hasRepeatedSpread ? "red-text" : "";
      },
    },
    {
      field: "base",
      headerName: "Base",
      width: 150,
      type: "number",
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        if (!params.value) {
          return null;
        }
        const initialRow = initialRows.find((row) => row.id === params.row.id);

        const isBaseChanged = initialRow?.base !== params.value;

        if (isBaseChanged && initialRow?.base) {
          return (
            <span>
              <span
                style={{
                  textDecoration: "line-through",
                  fontSize: 14,
                  marginRight: "10px",
                  color: "gray",
                }}
              >{`${initialRow?.base}%`}</span>
              <span>{`${params.value}%`}</span>
            </span>
          );
        }

        return (
          <span>
            {params.value === "-" ? params.value : `${params.value}%`}
          </span>
        );
      },
    },
    {
      field: "clients",
      headerName: "Grandes Clientes",
      width: 220,
      type: "number",
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      // valueFormatter: (params) => (params ? `${params}%` : ""),
      renderCell: (params) => {
        if (!params.value) {
          return null;
        }
        const isFirstRow = params.row.id === rows[0].id;

        const firstRow = initialRows[0];

        const isClientChanged = firstRow?.clients !== params.value;

        if (isClientChanged && isFirstRow) {
          return (
            <span>
              <span
                style={{
                  textDecoration: "line-through",
                  fontSize: 14,
                  marginRight: "10px",
                  color: "gray",
                }}
              >{`${firstRow?.clients}%`}</span>
              <span>{`${params.value}%`}</span>
            </span>
          );
        }

        return <span>{`${params.value}%`}</span>;
      },
      cellClassName: (params) =>
        params.value > maxVal || params.value < minVal ? "red-text" : "",
    },
    {
      field: "mobile",
      headerName: "Mobile App",
      width: 180,
      type: "number",
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      //valueFormatter: (params) => (params ? `${params}%` : ""),
      renderCell: (params) => {
        if (!params.value) {
          return null;
        }
        const isFirstRow = params.row.id === rows[0].id;

        const firstRow = initialRows[0];

        const isClientChanged = firstRow?.mobile !== params.value;

        if (isClientChanged && isFirstRow) {
          return (
            <span>
              <span
                style={{
                  textDecoration: "line-through",
                  fontSize: 14,
                  marginRight: "10px",
                  color: "gray",
                }}
              >{`${firstRow?.mobile}%`}</span>
              <span>{`${params.value}%`}</span>
            </span>
          );
        }

        return <span>{`${params.value}%`}</span>;
      },
      cellClassName: (params) =>
        params.value > maxVal || params.value < minVal ? "red-text" : "",
    },
  ];

  const columnGroupingModel: GridColumnGroupingModel = [
    {
      groupId: "2",
      headerName: "Tasa (Anual)",
      children: [
        { field: "id" },
        { field: "spread" },
        { field: "base" },
        { field: "clients" },
        { field: "mobile" },
      ],
    },
  ];

  const handleExportCSV = () => {
    // Get the visible rows and columns

    const columnFields = columns.map((column) => column.field);

    const csvData = rows.map((currentRow) => {
      return columnFields.reduce((acc, field) => {
        acc[field] = currentRow[field];
        return acc;
      }, {} as Record<string, any>);
    });

    // Convert to CSV and trigger download
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "exported_data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to add a new row
  const handleAddRow = () => {
    const newId = rows.length ? Math.max(...rows.map((row) => row.id)) + 1 : 1;
    const newRow = { id: newId, name: "", age: "", job: "" };
    setRows((prev) => [...prev, newRow]);
  };

  const handleProcessRowUpdate = (newRow: any, oldRow: any) => {
    const isBaseChanged = newRow.base !== oldRow.base;
    const isFirstRow = newRow.id === rows[0].id;
    const isClientsChanged = newRow.clients !== oldRow.clients;
    const isMobileChanged = newRow.mobile !== oldRow.mobile;
    const isSpreadChanged = newRow.spread !== oldRow.spread;
    let updatedRow = { ...newRow };

    if (isBaseChanged) {
      const clientsRatio = rows[0].clients;
      const mobileRatio = rows[0].mobile;
      //INFO: this takes old version of state rows
      console.log("row initial", rows[0]);
      console.log("clientsRatio", clientsRatio);
      updatedRow = {
        ...newRow,
        clients: newRow.base + clientsRatio,
        mobile: newRow.base + mobileRatio,
      };
      setRows((prev) => {
        const [firstRow, ...restRows] = prev;
        console.log("firstRow INSIDE", firstRow);
        const updatedRows = restRows.map((row) =>
          row.id === newRow.id ? updatedRow : row
        );
        return [firstRow, ...updatedRows];
      });
    }

    if (isFirstRow && isClientsChanged) {
      const [firstRow, ...restRows] = rows;
      const clientsRatioUpdatedRows = restRows.map((r) => {
        return {
          ...r,
          clients: r.base + newRow.clients,
        };
      });

      setRows([firstRow, ...clientsRatioUpdatedRows]);
    }

    if (isFirstRow && isMobileChanged) {
      const [firstRow, ...restRows] = rows;
      const mobileRatioUpdatedRows = restRows.map((r) => {
        return {
          ...r,
          mobile: r.base + newRow.mobile,
        };
      });

      setRows([firstRow, ...mobileRatioUpdatedRows]);
    }

    if (isSpreadChanged) {
      setRows((prev) => {
        let [firstRow, ...restRows] = prev;
        if (updatedRow.id === firstRow.id) {
          firstRow = updatedRow;
        } else {
          restRows = restRows.map((r) =>
            r.id === updatedRow.id ? updatedRow : r
          );
        }

        restRows.sort((a, b) => {
          if (a.spread < b.spread) return -1;
          if (a.spread > b.spread) return 1;
          return 0;
        });

        return [firstRow, ...restRows];
      });
    }

    return updatedRow;
  };

  return (
    <div>
      <Stack alignItems={"center"} gap={2} flexDirection={"row"}>
        {onClose && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              const hasChanges = hasArrayChanges([...initialRows], [...rows]);
              if (hasChanges) {
                if (
                  window.confirm(
                    "You have unsaved changes. Are you sure you want to close?"
                  )
                ) {
                  onClose();
                }
              } else {
                onClose();
              }
            }}
            style={{ marginBottom: 10 }}
          >
            Close x
          </Button>
        )}
        {onEdit && (
          <Button
            variant="contained"
            color="primary"
            onClick={onEdit}
            style={{ marginBottom: 10 }}
          >
            Edit
          </Button>
        )}
        {onSave && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => onSave(rows)}
            style={{ marginBottom: 10 }}
          >
            Save and close
          </Button>
        )}
        {editable && (
          <Button
            component="label"
            variant="contained"
            sx={{
              marginLeft: "auto",
              top: -5,
            }}
            startIcon={<CloudUploadIcon />}
          >
            Upload CSV
            <VisuallyHiddenInput
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
            />
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleExportCSV}
          style={{ marginBottom: 10, marginLeft: !editable ? "auto" : 0 }}
        >
          Export CSV
        </Button>
      </Stack>
      <div ref={gridRef} style={{ height: "auto", width: "100%" }}>
        <DataGridPro
          rows={rows}
          columns={columns}
          columnGroupingModel={columnGroupingModel}
          processRowUpdate={handleProcessRowUpdate}
          disableRowSelectionOnClick
          isCellEditable={(params) => {
            if (!editable) return false;
            return !(
              (params.row.spread === "Spread" && params.field === "spread") ||
              (params.row.spread === "Spread" && params.field === "base")
            );
          }}
          slots={{
            footer: () =>
              editable ? (
                <Stack
                  direction="row"
                  sx={{
                    padding: 1,
                    paddingLeft: 2,
                    borderTop: "1px solid rgba(224, 224, 224, 1)",
                  }}
                >
                  <IconButton aria-label="delete" onClick={handleAddRow}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              ) : (
                <></>
              ),
          }}
          // getRowId={(row) => row._id}
        />
      </div>
    </div>
  );
}

function hasArrayChanges<T extends Record<string, any>>(
  original: T[],
  updated: T[]
): boolean {
  if (original.length !== updated.length) return true;

  return original.some((origItem, index) => {
    const updatedItem = updated[index];

    // Check if keys or values have changed
    return Object.keys(origItem).some(
      (key) => origItem[key] !== updatedItem?.[key]
    );
  });
}
