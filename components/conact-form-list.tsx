"use client";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import { PATH } from "@/constants/path";
import Pagination from "./ui/pagenation";
import { redirect } from "next/navigation";
import { useAdminContext } from "@/context/storeAdmin";
import Breadcrumbs from "@/components/breadcrumb";
import Spinner from "./spinner";
import { debounce } from "lodash";
import UseGetContactFrom from "@/hooks/UseGetContactFrom";
import { Input } from "./ui/input";
interface UserContact {
  _id: string;
  username: string;
  email: string;
  message: string;
  webname: string;
}
interface TableColumn {
  label: string;
  name?: string;
}
const ContactFromListForm = () => {
  const { admin } = useAdminContext();

  if (!admin) {
    redirect(PATH.ADMIN.path);
  }
  const [userContactList, setuserContactList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState(""); // To store the currently sorted column
  const [sortOrder, setSortOrder] = useState("desc"); // To store the sorting order (asc or desc)
  const [loader, setloader] = useState(true);
  const [searchName, setsearchName] = useState("");

  const fetchUserContactList = async () => {
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
        "&&searchName=" +
        searchName;
      UseGetContactFrom(getData)
        .then((result) => {
          setuserContactList(result.data.result.data.result);
          setCurrentPage(result.data.result.data.currentPage);
          setTotalPages(result.data.result.data.totalPages);
          setPageSize(result.data.result.data.pageSize);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          // Handle error state or display an error message
        })
        .finally(() => {
          setloader(false);
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const debouncedFetchUserContactList = debounce(fetchUserContactList, 300);
  useEffect(() => {
    try {
      // Handle other data values as needed
      debouncedFetchUserContactList();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [currentPage, pageSize, searchName]);
  const columnsName = [
    { label: "App Name", value: "webname" },
    { label: "User Name", value: "username" },
    { label: "Email Address", value: "email" },
    { label: "Message", value: "message" },
  ];
  const columns = [
    {
      name: "App Name",
      selector: (row: UserContact) => row?.webname,
      sortable: true,
    },
    {
      name: "User Name",
      selector: (row: UserContact) => row.username,
      sortable: true,
    },
    {
      name: "Email Address",
      selector: (row: UserContact) => row.email,
      sortable: true,
    },
    {
      name: "Message",
      selector: (row: UserContact) => row.message,
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
    // debouncedfetchData();
  };
  const debouncedhandlePageChange = debounce(handlePageChange, 200);
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
      label: PATH.UserContactForm.name,
      path: PATH.UserContactForm.path,
    },
  ];
  const handleNameSearch = (value: string) => {
    setsearchName(value);
    setCurrentPage(1);
    setPageSize(10);
  };
  const debounceHandleNameSearch = debounce(handleNameSearch, 500);
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
                {PATH.UserContactForm.name}
              </h1>
            </div>
            <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-start">
              <Input
                id={"name"}
                placeholder="Name or Email or App Name"
                onChange={(e) => {
                  debounceHandleNameSearch(e.target.value);
                }}
              />
            </div>
          </div>
          {loader == true ? (
            <Spinner /> // Display a loading state
          ) : (
            <DataTable
              columns={columns}
              data={userContactList}
              highlightOnHover
              pagination={true}
              paginationPerPage={10}
              paginationComponent={() => (
                <CustomPagination
                  pages={totalPages}
                  page={currentPage}
                  onClick={debouncedhandlePageChange}
                />
              )}
              paginationComponentOptions={{
                rowsPerPageText: "Records per page:",
                rangeSeparatorText: "out of",
              }}
              paginationTotalRows={userContactList.length * totalPages}
              onChangePage={debouncedhandlePageChange}
              onChangeRowsPerPage={handleRowsPerPageChange}
              onSort={(column, sortDirection) =>
                handleSort(column as TableColumn, sortDirection)
              }
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ContactFromListForm;
