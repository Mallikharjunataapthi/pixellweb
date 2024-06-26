"use client";
import Link from "next/link";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import UseActionTemplate from "@/hooks/UseActionTemplate";
import { getEndpointUrl, ENDPOINTS } from "@/constants/endpoints";
import UseGetTemplateFeedback from "@/hooks/UseGetTemplateFeedback";
import { useAdminContext } from "@/context/storeAdmin";
import { redirect } from "next/navigation";
import { PATH } from "@/constants/path";
import Breadcrumbs from "@/components/breadcrumb";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Pagination from "./ui/pagenation";
import Spinner from "./spinner";
import { debounce } from "lodash";
interface templatefeedback {
  _id: string;
  template_name: string;
  template_id: {
    _id: number;
    template_name: string;
  };
  user_id: {
    username: string;
  };
  app_id: number;
  app_name: string;
  feedback: string;
  is_active: number;
}
interface TableColumn {
  label: string;
  name?: string;
}
const TemplateFeedbackListForm = () => {
  const { admin } = useAdminContext();

  if (!admin) {
    redirect(PATH.ADMIN.path);
  }
  const [templateList, setTemplateList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState(""); // To store the currently sorted column
  const [sortOrder, setSortOrder] = useState("desc"); // To store the sorting order (asc or desc)
  const [openModal, setOpenModal] = useState(false);
  const [deleteTemplateFeedbackId, setdeleteTemplateFeedbackId] = useState("");
  const [loader, setloader] = useState(true);
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
      await UseGetTemplateFeedback(getData)
        .then((result) => {
          setTemplateList(result.data.data.data);
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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const debouncedfetchData = debounce(fetchData, 300);
  useEffect(() => {
    debouncedfetchData();
  }, [currentPage]);
  const columnsName = [
    { label: "Template Name", value: "template_name" },
    { label: "User Name", value: "username" },
    { label: "Feedback", value: "feedback" },
    { label: "Status", value: "is_active" },
  ];

  const columns = [
    {
      name: "App Name",
      selector: (row: templatefeedback) => row?.app_name,
      sortable: true,
    },
    {
      name: "Template Name",
      selector: (row: templatefeedback) => row?.template_id?.template_name,
      sortable: true,
      cell: (row: templatefeedback) => (
        <Link
          className="text-blue-300 hover:text-red block text-sm"
          href={"template/" + row?.template_id?._id}
        >
          {row?.template_id?.template_name != undefined ||
          row?.template_id?.template_name != null
            ? row?.template_id?.template_name
            : row?.template_id?._id}
        </Link>
      ),
    },
    {
      name: "User Name",
      selector: (row: templatefeedback) => row?.user_id?.username,
      sortable: true,
    },
    {
      name: "Feedback",
      selector: (row: templatefeedback) => row.feedback,
      sortable: true,
    },
    {
      name: "Status",
      cell: (row: templatefeedback) =>
        row.is_active == 1 ? (
          <div>
            <button
              className="bg-red-700 rounded-sm text-white py-.8 px-1 text-sm m-1"
              onClick={() => {
                setOpenModal(true);
                setdeleteTemplateFeedbackId(
                  getEndpointUrl(ENDPOINTS.templatefeedback + "/" + row?._id),
                );
              }}
            >
              Active
            </button>
          </div>
        ) : (
          <div>Inactive</div>
        ),
    },
  ];
  async function ActionTemplate() {
    if (deleteTemplateFeedbackId != "") {
      try {
        // Handle other data values as needed
        await UseActionTemplate(deleteTemplateFeedbackId, { is_active: 0 });
        const updatedItems = templateList.filter(
          (item: templatefeedback) => item._id !== deleteTemplateFeedbackId,
        );
        if (updatedItems.length == 0) {
          if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        }
        fetchData();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    setdeleteTemplateFeedbackId("");
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
  const debouncedhandlePageChange = debounce(handlePageChange, 200);
  const debouncedhandleRowsPerPageChange = debounce(
    handleRowsPerPageChange,
    200,
  );
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
      label: PATH.TemplateFeedbackList.name,
      path: PATH.TemplateFeedbackList.path,
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
                Template User Feedback
              </h1>
            </div>
          </div>
          {loader == true ? (
            <Spinner /> // Display a loading state
          ) : (
            <DataTable
              columns={columns}
              data={templateList}
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
              paginationTotalRows={templateList.length * totalPages}
              onChangePage={debouncedhandlePageChange}
              onChangeRowsPerPage={debouncedhandleRowsPerPageChange}
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
          setdeleteTemplateFeedbackId("");
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to Inactive this Template Feedback?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  setOpenModal(false);
                  ActionTemplate();
                }}
              >
                {"Yes, I'm sure"}
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setOpenModal(false);
                  setdeleteTemplateFeedbackId("");
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

export default TemplateFeedbackListForm;
