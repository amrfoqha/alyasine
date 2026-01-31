import Pagination from "@mui/material/Pagination";

const UsePagination = ({ Page, setPage, totalPages, dir = "rtl" }) => {
  return (
    <Pagination
      count={totalPages}
      page={Page}
      onChange={(e, value) => setPage(value)}
      siblingCount={1}
      boundaryCount={2}
      showFirstButton
      showLastButton
      size="large"
      variant="outlined"
      sx={{
        "& .MuiPaginationItem-root": {
          borderRadius: "12px",
          fontSize: "20px",
          margin: "0 8px",
          marginBottom: "25px",
        },
        "& .Mui-selected": {
          background:
            "linear-gradient(135deg, var(--primary), var(--secondary))",
          color: "#fff",
        },
        "& .MuiPaginationItem-root:hover": {
          background:
            "linear-gradient(135deg, var(--primary), var(--secondary))",
          color: "#fff",
        },
        "& .MuiPaginationItem-root.Mui-selected:hover": {
          background:
            "linear-gradient(135deg, var(--primary), var(--secondary))",
          color: "#fff",
        },
      }}
      dir={dir}
    />
  );
};

export default UsePagination;
