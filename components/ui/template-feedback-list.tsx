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
interface templatefeedback {
  _id: number;
  template_name: string;
  template_id: {
    _id: number;
    template_name: string;
  };
  user_id: {
    username: string;
  };
  feedback: string;
  is_active: number;
}
interface TableColumn {
  label: string;
  name?: string;
}
import Pagination from "./pagenation";
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
      const resultCategory = await UseGetTemplateFeedback(getData);
      setTemplateList(resultCategory.data.data.data);
      setCurrentPage(resultCategory.data.data.currentPage);
      setTotalPages(resultCategory.data.data.totalPages);
      setPageSize(resultCategory.data.data.pageSize);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
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
      UseGetTemplateFeedback(getData).then((result) => {
        setTemplateList(result.data.data.data);
        setCurrentPage(result.data.data.currentPage);
        setTotalPages(result.data.data.totalPages);
        setPageSize(result.data.data.pageSize);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [totalPages, currentPage, pageSize, sortOrder, sortField]);
  const columnsName = [
    { label: "Template Name", value: "template_name" },
    { label: "User Name", value: "username" },
    { label: "Feedback", value: "feedback" },
    { label: "Status", value: "is_active" },
  ];

  const columns = [
    {
      name: "Template Name",
      selector: (row: templatefeedback) => row.template_id.template_name,
      sortable: true,
      cell: (row: templatefeedback) => (
        <Link
          style={{ width: "50px" }}
          className="text-blue-300 hover:text-red block text-sm"
          href={"template/" + row.template_id._id}
        >
          {row.template_id.template_name}
        </Link>
      ),
    },
    {
      name: "User Name",
      selector: (row: templatefeedback) => row.user_id.username,
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
              onClick={() =>
                ActionTemplate(
                  getEndpointUrl(ENDPOINTS.templatefeedback + "/" + row._id),
                )
              }
            >
              Active
            </button>
          </div>
        ) : (
          <div>Inactive</div>
        ),
    },
  ];
  async function ActionTemplate(url: string) {
    try {
      // Handle other data values as needed
      await UseActionTemplate(url, { is_active: 0 });
      fetchData();
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
                Template Feedback
              </h1>
            </div>
          </div>
          <DataTable
            //title="Category"
            columns={columns}
            data={templateList}
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
            paginationTotalRows={templateList.length * totalPages}
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

export default TemplateFeedbackListForm;
