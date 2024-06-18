"use client";
import Link from "next/link";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import UseGetUsers from "@/hooks/UseGetUsers";
import { PATH } from "@/constants/path";
import { redirect } from "next/navigation";
import Pagination from "./ui/pagenation";
import { getEndpointUrl, ENDPOINTS } from "@/constants/endpoints";
import { useAdminContext } from "@/context/storeAdmin";
import Breadcrumbs from "@/components/breadcrumb";
import Image from "next/image";
import Spinner from "./spinner";
import UseGetApp from "@/hooks/UseGetApp";
import { Input } from "./ui/input";
import { debounce } from "lodash";
import { Button, Modal } from "flowbite-react";
import UseDeleteUser from "@/hooks/UseDeleteUser";
interface UserDetails {
  _id: string;
  username: string;
  role_id: string;
  email: string;
  profile_img: string;
  app_id: { app_name: string };
}
interface TableColumn {
  label: string;
  name?: string;
}
interface AppItem {
  _id: number;
  app_name: string;
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
  const [loader, setloader] = useState(true);
  const [appList, setAppList] = useState([]);
  const [searchApp, setSearchApp] = useState("");
  const [searchName, setSearchName] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [deleteUserId, setdeleteUserId] = useState(""); // Handle other data values as needed
  const fetchData = async () => {
    const appurl = getEndpointUrl(ENDPOINTS.apps);
    const resultApp = await UseGetApp(appurl);
    const AppOption = resultApp?.data?.result?.result
      ? resultApp?.data?.result?.result.map((item: AppItem) => ({
          label: item.app_name,
          value: item._id,
        }))
      : [];
    setAppList(AppOption);
  };
  const fetchList = async () => {
    const getData =
      "?currentPage=" +
      currentPage +
      "&&pageSize=" +
      pageSize +
      "&&searchApp=" +
      searchApp +
      "&&searchName=" +
      searchName;
    const url = getEndpointUrl(ENDPOINTS.users + getData);
    UseGetUsers(url)
      .then((result) => {
        setAdminList(result.data.data.data);
        setCurrentPage(result.data.data.currentPage);
        setTotalPages(result.data.data.totalPages);
        setPageSize(result.data.data.pageSize);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Handle error state or display an error message
      })
      .finally(() => {
        setloader(false);
      });
  };
  const debouncedfetchList = debounce(fetchList, 300);
  const debouncedfetchData = debounce(fetchData, 300);
  useEffect(() => {
    try {
      // Handle other data values as needed
      debouncedfetchData();
      debouncedfetchList();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);
  useEffect(() => {
    try {
      // Handle other data values as needed
      debouncedfetchList();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [searchName, searchApp, currentPage, pageSize]);
  const columnsName = [{ label: "Name", value: "username" }];

  const columns = [
    {
      name: "App Name",
      selector: (row: UserDetails) => row?.app_id?.app_name || "",

      cell: (row: UserDetails) => row?.app_id?.app_name || "",
      sortable: true,
    },
    {
      name: "Name",
      selector: (row: UserDetails) => row?.username || "",
      cell: (row: UserDetails) => (
        <Link
          className="text-blue-300 hover:text-red block text-sm"
          href={"admin-registration/" + row._id}
        >
          {row?.username || ""}
        </Link>
      ),
      sortable: true,
    },
    {
      name: "Email",
      selector: (row: UserDetails) => row?.email || "",
      cell: (row: UserDetails) => row?.email || "",
      sortable: true,
    },
    {
      name: "Profile Image",
      selector: (row: UserDetails) => row?.profile_img || "",
      cell: (row: UserDetails) =>
        row?.profile_img !== undefined &&
        row?.profile_img !== null &&
        row?.profile_img !== "" &&
        row?.profile_img !== "''" &&
        row?.profile_img !== "null" && (
          <Image
            className="text-blue-300 hover:text-red block text-sm"
            src={row?.profile_img || ""}
            alt="test"
            width={100}
            height={100}
          />
        ),
    },
    {
      name: "Role",
      selector: (row: UserDetails) => row?.role_id || "",
      cell: (row: UserDetails) =>
        row?.role_id == "0"
          ? "Admin"
          : row?.role_id == "2"
            ? "Admin User"
            : "User" || "",
      sortable: true,
    },
    {
      name: "Action",
      selector: (row: UserDetails) => row?.role_id || "",
      cell: (row: UserDetails) =>
        row?.role_id != "0" && (
          <div>
            <button
              className="bg-red-700 rounded-sm text-white py-.8 px-1 text-sm m-1"
              onClick={() => {
                setOpenModal(true);
                setdeleteUserId(row._id);
              }}
            >
              Delete
            </button>
          </div>
        ),
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
    colvalue;
    sortDirection;
  };
  const handleNameSearch = (value: string) => {
    setSearchName(value);
    setCurrentPage(1);
    setPageSize(10);
  };
  const debounceHandleNameSearch = debounce(handleNameSearch, 500);
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
  const deleteUser = async () => {
    try {
      if (deleteUserId != "") {
        // Handle other data values as needed
        await UseDeleteUser(deleteUserId);
        const updatedItems = adminList.filter(
          (item: UserDetails) => item._id !== deleteUserId,
        );
        setAdminList([...updatedItems]);
        if (updatedItems.length == 0) {
          if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        }
        fetchList();
      }
      setdeleteUserId("");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <>
      <div className="py-6">
        <Breadcrumbs items={breadcrumbItems} />
      </div>
      <div>
        <div className="lg:col-12">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="sm:text-left">
              <h1 className="font-bold text-gray-900 header-font"> User </h1>
            </div>
            <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-start">
              <Input
                id={"name"}
                placeholder="Name or Email"
                onChange={(e) => {
                  debounceHandleNameSearch(e.target.value);
                }}
              />
            </div>
            <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-start">
              <select
                id="app_id"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => {
                  setSearchApp(e.target.value);
                  setCurrentPage(1);
                  setPageSize(10);
                }}
              >
                <option key={0} value="">
                  {"Select App"}
                </option>
                {appList.map((option: { value: number; label: string }) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
          {loader == true ? (
            <Spinner /> // Display a loading state
          ) : (
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
                  onClick={debouncedhandlePageChange}
                />
              )}
              paginationComponentOptions={{
                rowsPerPageText: "Records per page:",
                rangeSeparatorText: "out of",
              }}
              paginationTotalRows={adminList.length * totalPages}
              onChangePage={debouncedhandlePageChange}
              onChangeRowsPerPage={handleRowsPerPageChange}
              onSort={(column, sortDirection) =>
                handleSort(column as TableColumn, sortDirection)
              }
            />
          )}
        </div>
      </div>
      <Modal
        show={openModal}
        size="sm"
        onClose={() => {
          setOpenModal(false);
          setdeleteUserId("");
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this User?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  setOpenModal(false);
                  deleteUser();
                }}
              >
                {"Yes, I'm sure"}
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setOpenModal(false);
                  setdeleteUserId("");
                }}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AdminListForm;
