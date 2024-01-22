"use client";
import Link from "next/link";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import Pagination from "./pagenation";
import { getEndpointUrl, ENDPOINTS } from "@/constants/endpoints";
import UseGetReports from "@/hooks/UseGetreports";
import { useAdminContext } from "@/context/storeAdmin";
import { redirect } from "next/navigation";
import { PATH } from "@/constants/path";
import Breadcrumbs from "@/components/breadcrumb";
interface mostusedtemplate {
  category_name: string;
  cat_id: number;
  template_name: string;
  _id: number;
  used_count: number;
}
interface TableColumn {
  label: string;
  name?: string;
}
const MostUsedTemplatesList = () => {
  const { admin } = useAdminContext();

  if (!admin) {
    redirect(PATH.ADMIN.path);
  }
  const [mostActiveUsersList, setMostActiveUsersList] = useState([]);
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
      const url = getEndpointUrl(
        ENDPOINTS.adminreport + ENDPOINTS.mostusedtemplates + getData,
      );
      UseGetReports(url).then((result) => {
        setMostActiveUsersList(result?.data?.result?.data?.result);
        setCurrentPage(result?.data?.result?.data?.currentPage);
        setTotalPages(result?.data?.result?.data?.totalPages);
        setPageSize(result?.data?.result?.data?.pageSize);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [currentPage, pageSize, sortOrder, sortField]);
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
      const url = getEndpointUrl(
        ENDPOINTS.adminreport + ENDPOINTS.mostusedtemplates + getData,
      );
      await UseGetReports(url).then((result) => {
        setMostActiveUsersList(result?.data?.result?.data?.result);
        setCurrentPage(result?.data?.result?.data?.currentPage);
        setTotalPages(result?.data?.result?.data?.totalPages);
        setPageSize(result?.data?.result?.data?.pageSize);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const columnsName = [
    { label: "Category Name", value: "category_name" },
    { label: "Template Name", value: "template_name" },
    { label: "Used Count", value: "used_count" },
  ];

  const columns = [
    {
      name: "Category Name",
      selector: (row: mostusedtemplate) => row?.category_name || "",

      cell: (row: mostusedtemplate) => (
        <Link
          className="text-blue-300 hover:text-red block text-sm"
          href={"category/" + row.cat_id}
        >
          {row?.category_name || ""}
        </Link>
      ),
      sortable: true,
    },
    {
      name: "Template Name",
      selector: (row: mostusedtemplate) => row?.template_name || "",

      cell: (row: mostusedtemplate) => (
        <Link
          className="text-blue-300 hover:text-red block text-sm"
          href={"template/" + row._id}
        >
          {row?.template_name || ""}
        </Link>
      ),
      sortable: true,
    },
    {
      name: "Used Count",
      selector: (row: mostusedtemplate) => row?.used_count,
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
      label: PATH.MostUsedTemplates.name,
      path: PATH.MostUsedTemplates.path,
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
                Most Used Templates{" "}
              </h1>
            </div>
          </div>
          <DataTable
            columns={columns}
            data={mostActiveUsersList}
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
            paginationTotalRows={mostActiveUsersList.length * totalPages}
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

export default MostUsedTemplatesList;
