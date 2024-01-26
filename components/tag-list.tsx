"use client";

import Link from "next/link";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import UseGetTag from "@/hooks/UseGetTag";
import UseDeleteTag from "@/hooks/UseDeleteTag";
import { PATH } from "@/constants/path";
import Pagination from "./ui/pagenation";
import { useAdminContext } from "@/context/storeAdmin";
import { redirect } from "next/navigation";
import Breadcrumbs from "@/components/breadcrumb";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Spinner from "./spinner";
interface Tag {
  _id: string;
  tag_name: string;
  is_active: number;
  app_id: { app_name: string; _id: number };
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
  const [openModal, setOpenModal] = useState(false);
  const [deleteTagId, setDeleteTagId] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
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
      await UseGetTag(getData).then((result) => {
        setTagList(result?.data?.data?.result);
        setCurrentPage(result?.data?.data?.currentPage);
        setTotalPages(result?.data?.data?.totalPages);
        setPageSize(result?.data?.data?.pageSize);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [currentPage]);
  const columnsName = [
    { label: "Name", value: "tag_name" },
    { label: "Status", value: "is_active" },
  ];

  const columns = [
    {
      name: "App Name",
      selector: (row: Tag) => row?.app_id?.app_name,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row: Tag) => row?.tag_name || "",

      cell: (row: Tag) => (
        <Link
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
          onClick={() => {
            setOpenModal(true);
            setDeleteTagId(row._id);
          }}
        >
          Delete
        </button>
      ),
    },
  ];
  async function deleteTag() {
    try {
      if (deleteTagId != "") {
        // Handle other data values as needed
        await UseDeleteTag(deleteTagId);
        const updatedItems = tagList.filter(
          (item: Tag) => item._id !== deleteTagId,
        );
        setTagList([...updatedItems]);
        if (updatedItems.length == 0) {
          if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        }
        fetchData();
      }
      setDeleteTagId("");
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
    fetchData();
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
  if (loading) {
    return (
      <>
        <Spinner />
      </>
    );
  }
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
      <Modal
        show={openModal}
        size="sm"
        onClose={() => {
          setOpenModal(false);
          setDeleteTagId("");
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this Tag?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  setOpenModal(false);
                  deleteTag();
                }}
              >
                {"Yes, I'm sure"}
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setOpenModal(false);
                  setDeleteTagId("");
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

export default TagListForm;
