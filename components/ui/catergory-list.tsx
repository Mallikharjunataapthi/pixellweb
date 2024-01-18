"use client";
import Link from "next/link";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import UseGetCategory from "@/hooks/UseGetCategory";
import UseDeleteCategory from "@/hooks/UseDeleteCategory";
import { PATH } from "@/constants/path";
import { redirect } from "next/navigation";
import Pagination from "./pagenation";
import { getEndpointUrl, ENDPOINTS } from "@/constants/endpoints";
import { useAdminContext } from "@/context/storeAdmin";
import Breadcrumbs from "@/components/breadcrumb";
interface Category {
  _id: string;
  cat_name: string;
  is_active: number;
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

  useEffect(() => {
    try {
      // Handle other data values as needed

      const getData ="?currentPage=" + currentPage + "&&pageSize=" + pageSize;
      const url = getEndpointUrl(ENDPOINTS.category + getData);
      UseGetCategory(url).then((result) => {
        setCategoryList(result?.data?.result?.data?.result);
        setCurrentPage(result?.data?.result?.data?.currentPage);
        setTotalPages(result?.data?.result?.data?.totalPages);
        setPageSize(result?.data?.result?.data?.pageSize);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [currentPage, pageSize]);
  const columnsName = [
    { label: "Name", value: "cat_name" },
    { label: "Status", value: "is_active" },
  ];

  const columns = [
    {
      name: "Name",
      selector: (row: Category) => row?.cat_name || "",

      cell: (row: Category) => (
        <Link
          style={{ width: "50px" }}
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
          onClick={() => deleteCategory(row._id)}
        >
          Delete
        </button>
      ),
    },
  ];
  async function deleteCategory(cateogryId: string) {
    try {
      // Handle other data values as needed
      await UseDeleteCategory(cateogryId);
      const updatedItems = categoryList.filter(
        (item: Category) => item._id !== cateogryId,
      );
      setCategoryList([...updatedItems]);
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
                {" "}
                <button
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-5 py-2 text-blue-300 transition hover:bg-gray-50 hover:text-blue-400 focus:outline-none"
                  type="button"
                >
                  Add Category
                </button>
              </Link>
            </div>
          </div>
          <DataTable
            //title="Category"
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
        </div>
      </div>
    </>
  );
};

export default CategoryListForm;
