"use client";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import Pagination from "./pagenation";
import { getEndpointUrl, ENDPOINTS } from "@/constants/endpoints";
import UseGetReports from "@/hooks/UseGetreports";
import Link from "next/link";
import { useAdminContext } from "@/context/storeAdmin";
import { redirect } from "next/navigation";
import { PATH } from "@/constants/path";
import Breadcrumbs from "@/components/breadcrumb";
interface mostactiveusers {
  userName: string;
  user_id: number;
  userCount: number;
}
interface TableColumn {
  label: string;
  name?: string;
}
const MostActiveUsersList = () => {
  const { admin } = useAdminContext();

  if (!admin) {
    redirect(PATH.ADMIN.path);
  }
  const [mostActiveUsersList, setMostActiveUsersList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState(""); // To store the currently sorted column
  const [sortOrder, setSortOrder] = useState("desc"); // To store the sorting order (asc or desc)
  const [fromDatestring, setFromDatestring] = useState<Date>(
    new Date(new Date().setDate(new Date().getDate() - 7)),
  ); // Specify the type
  const [toDateString, setToDatetring] = useState<Date>(
    new Date(new Date().toJSON().slice(0, 10)),
  ); //
  useEffect(() => {
    if (fromDatestring != null) {
      try {
        // Handle other data values as needed
        const getData =
          "?currentPage=" +
          currentPage +
          "&&pageSize=" +
          pageSize +
          "&&sortField=" +
          sortField +
          "&&sortOrder=" +
          sortOrder +
          (fromDatestring
            ? "&&fromDatestring=" + fromDatestring.toISOString().split("T")[0]
            : "") +
          (fromDatestring && toDateString
            ? "&&toDateString=" + toDateString.toISOString().split("T")[0]
            : "");
        const url = getEndpointUrl(
          ENDPOINTS.adminreport + ENDPOINTS.mostactiveusers + getData,
        );
        // Append string data to the dateSearchData object
        UseGetReports(url).then((result) => {
          setMostActiveUsersList(result?.data?.result?.data?.result);
          setCurrentPage(result?.data?.result?.data?.currentPage);
          setTotalPages(result?.data?.result?.data?.totalPages);
          setPageSize(result?.data?.result?.data?.pageSize);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  }, [
    currentPage,
    pageSize,
    sortOrder,
    sortField,
    fromDatestring,
    toDateString,
  ]);

  const columnsName = [
    { label: "User Name", value: "userName" },
    { label: "Used Count", value: "userCount" },
  ];
  const columns = [
    {
      name: "User Name",
      selector: (row: mostactiveusers) => row?.userName || "",

      cell: (row: mostactiveusers) => (
        <Link
          className="text-blue-300 hover:text-red block text-sm"
          href={"category/" + row.user_id}
        >
          {row?.userName || ""}
        </Link>
      ),
      sortable: true,
    },
    {
      name: "Used Count",
      selector: (row: mostactiveusers) => row?.userCount,
      sortable: true,
    },
  ];

  const handlePageChange = (page: number) => {
    // Update the current page
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newPerPage: number, page: number) => {
    // Update the rows per page and current page
    page;
    setPageSize(newPerPage);
  };
  const CustomPagination = ({
    pages,
    page,
    onClick,
  }: {
    pages: number;
    page: number;
    onClick: (pageNumber: number) => void;
  }) => <Pagination page={page} pages={pages} onClick={onClick}></Pagination>;

  const handleSort = (column: TableColumn, sortDirection: string) => {
    const colname: string = column.name || "";
    const colfield = columnsName.find((col) => col?.label === colname);
    const colvalue: string = colfield ? colfield?.value : "";
    setSortField(colvalue);
    setSortOrder(sortDirection);
  };
  const breadcrumbItems = [
    {
      label: PATH.ADMINHOME.name,
      path: PATH.ADMINHOME.path,
    },
    {
      label: PATH.MostActiveUsers.name,
      path: PATH.MostActiveUsers.path,
    },
  ];

  return (
    <>
      <div className="py-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <div>
        <div className="lg:col-12">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:text-left">
              <h1 className="font-bold text-gray-900 header-font">
                Most Active Users
              </h1>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={mostActiveUsersList}
            highlightOnHover
            pagination={true}
            paginationPerPage={10}
            paginationComponent={() => (
              <CustomPagination
                pages={totalPages}
                page={currentPage}
                onClick={handlePageChange}
              />
            )}
            paginationComponentOptions={{
              rowsPerPageText: "Records per page:",
              rangeSeparatorText: "out of",
            }}
            paginationTotalRows={mostActiveUsersList.length * totalPages}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
            onSort={(column, sortDirection) =>
              handleSort(column as TableColumn, sortDirection)
            }
            subHeader
            subHeaderComponent={
              <>
                <label htmlFor="fromDatestring">From Date: </label>
                <input
                  type="date"
                  value={
                    fromDatestring
                      ? fromDatestring.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => setFromDatestring(new Date(e.target.value))}
                  id="fromDatestring"
                />
                <label htmlFor="toDateString">To Date: </label>
                <input
                  type="date"
                  value={
                    toDateString ? toDateString.toISOString().split("T")[0] : ""
                  }
                  onChange={(e) => setToDatetring(new Date(e.target.value))}
                  id="toDateString"
                />
              </>
            }
          />
        </div>
      </div>
    </>
  );
};

export default MostActiveUsersList;
