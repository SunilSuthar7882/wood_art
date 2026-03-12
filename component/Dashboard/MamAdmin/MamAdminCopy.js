import { useGetMamAdminsInfinite } from "@/helpers/hooks/mamAdmin/mamAdmin";
import { DataGrid } from "@mui/x-data-grid";

export default function MamAdminCopy() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useGetMamAdminsInfinite();

 

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: true,
      width: 160,
    },
    {
      field: "phoneNumber",
      headerName: "Phone number",
      width: 150,
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
    },
  ];

  const rows =
    data?.pages.flatMap((page) =>
      page.data.page_data.map((row) => ({
        id: row.id,
        fullName: row.full_name,
        phoneNumber: row.phone_number,
        status: row.status,
      }))
    ) || [];

 

  const handleScroll = (params) => {
  

    const threshold = 100; // pixels from bottom
    const isNearBottom =
      params.viewportScrollTop + params.viewportHeight + threshold >=
      params.scrollHeight;

    if (isNearBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div>
      <div>
        {/* <DataGrid
          rows={rows}
          columns={columns}
          onScroll={handleScroll}
          scrollbarSize={17}
          autoHeight
          hideFooterPagination
          disableRowSelectionOnClick
          loading={status === "loading" || isFetchingNextPage}
          rowCount={rows.length}
        />

        {isFetchingNextPage && (
          <div className="text-center py-4">Loading more...</div>
        )} */}
        <DataGrid
          {...data}
          initialState={{
            ...data.initialState,
            pagination: {
              ...data.initialState?.pagination,
              paginationModel: {
                pageSize: 25,
                /* page: 0 // default value will be used if not passed */
              },
            },
          }}
        />

        {isFetchingNextPage && (
          <div className="text-center py-4">Loading more...</div>
        )}
      </div>
    </div>
  );
}
