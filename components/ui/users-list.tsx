"use client";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import UseGetUsers from "@/hooks/UseGetUsers";
import Link from "next/link";
import { useAdminContext } from "@/context/storeAdmin";
import { redirect } from "next/navigation";
import { PATH } from "@/constants/path";
import Breadcrumbs from "@/components/breadcrumb";
interface UserList {
  _id: number;
  username: string;
}
const UserListForm = () => {
  const { admin } = useAdminContext();

  if (!admin) {
    redirect(PATH.ADMIN.path);
  }
  const [userList, setuserList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchData = async () => {
    try {
      // Handle other data values as needed

      await UseGetUsers().then((result) => {
        setuserList(result.data.data);
        setTotalPages(result.data.totalPages);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    if (currentPage !== 1 || pageSize !== 10) {
      fetchData();
    }
  }, [currentPage, pageSize, fetchData]);
  const columns = [
    {
      name: "User Name",
      selector: (row: UserList) => row?.username || "",

      cell: (row: UserList) => (
        <Link
          style={{ width: "50px" }}
          className="text-blue-300 hover:text-red block text-sm"
          href={"category/" + row._id}
        >
          {row?.username || ""}
        </Link>
      ),
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
    fetchData();
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
              <h1 className="font-bold text-gray-900 header-font">User</h1>
            </div>
          </div>
          <DataTable
            //title="Category"
            columns={columns}
            data={userList}
            highlightOnHover
            pagination={true}
            paginationPerPage={10}
            paginationComponentOptions={{
              rowsPerPageText: "Records per page:",
              rangeSeparatorText: "out of",
            }}
            paginationTotalRows={userList.length * totalPages}
            onChangePage={handlePageChange}
            onChangeRowsPerPage={handleRowsPerPageChange}
          />
        </div>
      </div>
    </>
  );
};

export default UserListForm;
