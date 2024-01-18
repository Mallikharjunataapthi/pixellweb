"use client";

import Link from "next/link";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import UseGetTag from "@/hooks/UseGetTag";
import UseDeleteTag from "@/hooks/UseDeleteTag";
import { PATH } from "@/constants/path";
import Pagination from "./pagenation";
import { useAdminContext } from "@/context/storeAdmin";
import { redirect } from "next/navigation";
import Breadcrumbs from "@/components/breadcrumb";
interface Tag {
  _id: string;
  tag_name: string;
  is_active: number;
}
interface TableColumn {
  label: string;
  name?: string;
}
const TagListForm = () => {
  const { admin } = useAdminContext();

  if (!admin) {
    redirect(PATH.ADMIN.path);
  }
  const [tagList, setTagList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState(""); // To store the currently sorted column
  const [sortOrder, setSortOrder] = useState("desc"); // To store the sorting order (asc or desc)

  useEffect(() => {
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
        sortOrder;
      UseGetTag(getData).then((result) => {
        setTagList(result?.data?.data?.result);
        setCurrentPage(result?.data?.data?.currentPage);
        setTotalPages(result?.data?.data?.totalPages);
        setPageSize(result?.data?.data?.pageSize);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [totalPages, currentPage, pageSize, sortOrder, sortField]);
  const columnsName = [
    { label: "Name", value: "tag_name" },
    { label: "Status", value: "is_active" },
  ];

  const columns = [
    {
      name: "Name",
      selector: (row: Tag) => row?.tag_name || "",

      cell: (row: Tag) => (
        <Link
          style={{ width: "50px" }}
          className="text-blue-300 hover:text-red block text-sm"
          href={"tag/" + row._id}
        >
          {row?.tag_name || ""}
        </Link>
      ),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row: Tag) => (row?.is_active == 1 ? "Active" : "Inactive"),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: Tag) => (
        <button
          className="bg-red-700 rounded-sm text-white py-.8 px-1 text-sm"
          onClick={() => deleteTag(row._id)}
        >
          Delete
        </button>
      ),
    },
  ];
  async function deleteTag(tagId: string) {
    try {
      // Handle other data values as needed
      await UseDeleteTag(tagId);
      const updatedItems = tagList.filter((item: Tag) => item._id !== tagId);
      setTagList([...updatedItems]);
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
    setSortField(colvalue);
    setSortOrder(sortDirection);
  };
  const breadcrumbItems = [
    {
      label: PATH.ADMINHOME.name,
      path: PATH.ADMINHOME.path,
    },
    {
      label: PATH.TagList.name,
      path: PATH.TagList.path,
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
              <h1 className="font-bold text-gray-900 header-font">Tag </h1>
            </div>
            <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-start">
              <Link href={PATH.Addtag.path}>
                {" "}
                <button
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-5 py-2 text-blue-300 transition hover:bg-gray-50 hover:text-blue-400 focus:outline-none"
                  type="button"
                >
                  Add Tag
                </button>
              </Link>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={tagList}
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
            paginationTotalRows={tagList.length * totalPages}
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

export default TagListForm;
