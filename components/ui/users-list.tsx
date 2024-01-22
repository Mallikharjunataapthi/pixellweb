"use client";
import Link from "next/link";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import UseGetUsers from "@/hooks/UseGetUsers";
import { PATH } from "@/constants/path";
import { redirect } from "next/navigation";
import Pagination from "./pagenation";
import { getEndpointUrl, ENDPOINTS } from "@/constants/endpoints";
import { useAdminContext } from "@/context/storeAdmin";
import Breadcrumbs from "@/components/breadcrumb";
interface Tag {
  _id: string;
  username: string;
}
interface TableColumn {
  label: string;
  name?: string;
}
const AdminListForm = () => {
  const { admin } = useAdminContext();

  if (!admin) {
    redirect(PATH.ADMIN.path);
  }

  const [adminList, setAdminList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    try {
      // Handle other data values as needed

      const getData = "?currentPage=" + currentPage + "&&pageSize=" + pageSize;
      const url = getEndpointUrl(ENDPOINTS.users + getData);
      UseGetUsers(url).then((result) => {
        console.log(result.data.data.data);
        setAdminList(result.data.data.data);
        setCurrentPage(result.data.data.currentPage);
        setTotalPages(result.data.data.totalPages);
        setPageSize(result.data.data.pageSize);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [currentPage, pageSize]);
  const columnsName = [{ label: "Name", value: "username" }];

  const columns = [
    {
      name: "Name",
      selector: (row: Tag) => row?.username || "",

      cell: (row: Tag) => row?.username || "",
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
    colvalue;
    sortDirection;
  };
  const breadcrumbItems = [
    {
      label: PATH.ADMINHOME.name,
      path: PATH.ADMINHOME.path,
    },
    {
      label: PATH.UsersList.name,
      path: PATH.UsersList.path,
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
              <h1 className="font-bold text-gray-900 header-font">Admin </h1>
            </div>
            <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-start">
              <Link href={PATH.AdddAdmin.path}>
                <button
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-5 py-2 text-blue-300 transition hover:bg-gray-50 hover:text-blue-400 focus:outline-none"
                  type="button"
                >
                  Add Admin
                </button>
              </Link>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={adminList}
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
            paginationTotalRows={adminList.length * totalPages}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
            onSort={(column, sortDirection) =>
              handleSort(column as TableColumn, sortDirection)
            }
          />
        </div>
      </div>
    </>
  );
};

export default AdminListForm;
