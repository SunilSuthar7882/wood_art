"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DataGrid, GridRow } from "@mui/x-data-grid";
import { Box, Tooltip } from "@mui/material";

const CustomTable = ({
  columns,
  rows,
  onRowClick,
  pagination = { page: 0, rowsPerPage: 0, totalRows: 0 },
  onPageChange,
  onRowsPerPageChange,
  hideFooter = false,
  loading,
  getRowClassName,
  getRowHeight,
  containerSx = {},
  getRowTooltip,
  noDataMessage,
  noRowsOverlay,
  ...sx
}) => {
  const { page, rowsPerPage, totalRows } = pagination;
  const [mounted, setMounted] = useState(false);

  // const CustomRowWithTooltip = (props) => {
  //   const { row } = props;
  //   const isMounted = useRef(true);

  //   useEffect(() => {
  //     return () => {
  //       isMounted.current = false;
  //     };
  //   }, []);

  //   const tooltipTitle = useMemo(() => {
  //     if (!isMounted.current) return "";
  //     try {
  //       return getRowTooltip?.(row);
  //     } catch (e) {
  //       console.error("Error in getRowTooltip:", e);
  //       return "";
  //     }
  //   }, [row, getRowTooltip]);

  //   return tooltipTitle ? (
  //     <Tooltip title={tooltipTitle} arrow placement="top" followCursor>
  //       <div style={{ display: "contents" }}>
  //         <GridRow {...props} />
  //       </div>
  //     </Tooltip>
  //   ) : (
  //     <GridRow {...props} />
  //   );
  // };




  const CustomRowWithTooltip = (props) => {
  const { row } = props;

  let tooltipTitle = "";
  try {
    tooltipTitle = getRowTooltip?.(row) || "";
  } catch (e) {
    console.error("Error in getRowTooltip:", e);
  }

  return tooltipTitle ? (
    <Tooltip title={tooltipTitle} arrow placement="top" followCursor>
      <div style={{ display: "contents" }}>
        <GridRow {...props} />
      </div>
    </Tooltip>
  ) : (
    <GridRow {...props} />
  );
};




  const handlePaginationChange = (model) => {
  if (model.page !== page) {
    onPageChange?.(model.page);
  }
  if (model.pageSize !== rowsPerPage) {
    onRowsPerPageChange?.(model.pageSize);
  }
};

  useEffect(() => {
    setMounted(true);
  }, []);
  const CustomNoRowsOverlay = () => (
    <Box
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ p: 2, fontSize: 14, color: "gray" }}
    >
      {loading ? null : noDataMessage}
    </Box>
  );

  if (!mounted) return null;

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box flex={1} overflow={"auto"} sx={containerSx}>
        <DataGrid
          rows={rows || []}
          columns={columns}
          // initialState={{
          //   pagination: {
          //     paginationModel: { page, pageSize: rowsPerPage },
          //   },
          // }}
          paginationModel={{ page, pageSize: rowsPerPage }}
          pageSizeOptions={[5, 10, 25]}
          rowCount={totalRows}
          onPaginationModelChange={handlePaginationChange}
          disableRowSelectionOnClick
          hideFooter={hideFooter}
          onRowClick={onRowClick}
          paginationMode="server"
          loading={loading}
          getRowHeight={getRowHeight}
          getRowClassName={getRowClassName}
          slots={{
            row: CustomRowWithTooltip,
            noRowsOverlay: noRowsOverlay,
          }}
          slotProps={{
            loadingOverlay: {
              variant: "skeleton",
              noRowsVariant: "skeleton",
            },
          }}
          sx={{
            "& .mui-1tdeh38": {
              backgroundColor: "#ffffff !important",
            },
            "& .mui-1jlz3st": {
              backgroundColor: "#ffffff",
            },
            "& .MuiDataGrid-row:hover": {
              cursor: "pointer",
            },
            "& .MuiDataGrid-row.bg-red-100:hover": {
              backgroundColor: "#fee2e2",
              cursor: "default",
            },
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
              boxShadow: "none",
            },
            "& .MuiDataGrid-row": {
              borderRadius: "0px",
            },
            "& .MuiDataGrid-columnHeader:focus": {
              outline: "none",
              boxShadow: "none",
            },
            "& .MuiDataGrid-cell button:focus": {
              outline: "none",
              boxShadow: "none",
            },
            "& .MuiDataGrid-columnHeader:focus-within": {
              outline: "none",
            },
            "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
              outline: "none !important",
            },
            ...sx,
          }}
        />
      </Box>
    </Box>
  );
};

export default CustomTable;
