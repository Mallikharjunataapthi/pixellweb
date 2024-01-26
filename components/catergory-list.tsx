"use client";
import Link from "next/link";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import UseGetCategory from "@/hooks/UseGetCategory";
import UseDeleteCategory from "@/hooks/UseDeleteCategory";
import { PATH } from "@/constants/path";
import { redirect } from "next/navigation";
import Pagination from "./ui//pagenation";
import { getEndpointUrl, ENDPOINTS } from "@/constants/endpoints";
import { useAdminContext } from "@/context/storeAdmin";
import Breadcrumbs from "@/components/breadcrumb";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Spinner from "./spinner";
interface Category {
  _id: string;
  cat_name: string;
  is_active: number;
  app_id: { app_name: string; _id: number };
}
interface TableColumn {
  label: string;
  name?: string;
}
const CategoryListForm = () => {
  const { admin } = useAdminContext();

  if (!admin) {
    redirect(PATH.ADMIN.path);
  }

  const [categoryList, setCategoryList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [deleteCatergoryId, setdeleteCatergoryId] = useState("");
  const fetchdata = async () => {
    try {
      // Handle other data values as needed
      const getData = "?currentPage=" + currentPage + "&&pageSize=" + pageSize;
      const url = await getEndpointUrl(ENDPOINTS.category + getData);
      UseGetCategory(url).then((result) => {
        setCategoryList(result?.data?.result?.data?.result);
        setCurrentPage(result?.data?.result?.data?.currentPage);
        setTotalPages(result?.data?.result?.data?.totalPages);
        setPageSize(result?.data?.result?.data?.pageSize);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchdata();
  }, [currentPage]);
  const columnsName = [
    { label: "Name", value: "cat_name" },
    { label: "Status", value: "is_active" },
    { label: "App Name", value: "app_name" },
  ];

  const columns = [
    {
      name: "App Name",
      selector: (row: Category) => row?.app_id?.app_name || "",
      cell: (row: Category) => row?.app_id?.app_name || "",
      sortable: true,
    },
    {
      name: "Name",
      selector: (row: Category) => row?.cat_name || "",
      cell: (row: Category) => (
        <Link
          className="text-blue-300 hover:text-red block text-sm"
          href={"category/" + row._id}
        >
          {row?.cat_name || ""}
        </Link>
      ),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row: Category) =>
        row?.is_active == 1 ? "Active" : "Inactive",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: Category) => (
        <button
          className="bg-red-700 rounded-sm text-white py-.8 px-1 text-sm"
          onClick={() => {
            setOpenModal(true);
            setdeleteCatergoryId(row._id);
          }}
        >
          Delete
        </button>
      ),
    },
  ];
  async function deleteCategory() {
    try {
      if (deleteCatergoryId != "") {
        // Handle other data values as needed
        await UseDeleteCategory(deleteCatergoryId);
        const updatedItems = categoryList.filter(
          (item: Category) => item._id !== deleteCatergoryId,
        );
        setCategoryList([...updatedItems]);
        if (updatedItems.length == 0) {
          if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        }
        fetchdata();
      }
      setdeleteCatergoryId("");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
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
      label: PATH.CategoryList.name,
      path: PATH.CategoryList.path,
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
              <h1 className="font-bold text-gray-900 header-font">Category </h1>
            </div>
            <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-start">
              <Link href={PATH.AddCategory.path}>
                <button
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-5 py-2 text-blue-300 transition hover:bg-gray-50 hover:text-blue-400 focus:outline-none"
                  type="button"
                >
                  Add Category
                </button>
              </Link>
            </div>
          </div>
          {categoryList === null ? (
            <Spinner /> // Display a loading state
          ) : (
            <DataTable
              columns={columns}
              data={categoryList}
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
              paginationTotalRows={categoryList.length * totalPages}
              onChangePage={handlePageChange}
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
          setdeleteCatergoryId("");
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this Catergory?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  setOpenModal(false);
                  deleteCategory();
                }}
              >
                {"Yes, I'm sure"}
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setOpenModal(false);
                  setdeleteCatergoryId("");
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

export default CategoryListForm;
