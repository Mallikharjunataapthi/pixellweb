"use client";
import Link from "next/link";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";
import UseDeleteTemplate from "@/hooks/UseDeleteTemplate";
import { PATH } from "@/constants/path";
import UseGetTemplate from "@/hooks/UseGetTemplate";
import UseActionTemplate from "@/hooks/UseActionTemplate";
import { getEndpointUrl, ENDPOINTS } from "@/constants/endpoints";
import Pagination from "./ui/pagenation";
import { redirect } from "next/navigation";
import { useAdminContext } from "@/context/storeAdmin";
import Breadcrumbs from "@/components/breadcrumb";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Spinner from "./spinner";
import UseGetApp from "@/hooks/UseGetApp";
import { debounce } from "lodash";
interface Template {
  _id: string;
  template_name: string;
  category_name: string;
  is_free: string;
  is_approved: string;
  is_active: number;
  app_id: { app_name: string; _id: number };
}
interface TableColumn {
  label: string;
  name?: string;
}
interface AppItem {
  _id: number;
  app_name: string;
}
const TemplateListForm = () => {
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
  const [templateId, setTemplateId] = useState("");
  const [templateactionurl, setTemplateactionurl] = useState("");
  const [actiontype, setActionType] = useState("");
  const [loader, setloader] = useState(true);
  const [appList, setAppList] = useState([]);
  const [searchApp, setSearchApp] = useState("");
  const [searchApproved, setSearchApproved] = useState("");
  const TemplateStatus: { [key: string]: string } = {
    Approved: "Approved",
    Declined: "Decline",
    Pending: "Pending",
  };
  const fetchData = async () => {
    try {
      // Handle other data values as needed
      const getData = "?currentPage=" + currentPage + "&&pageSize=" + pageSize;
      const resultCategory = await UseGetTemplate(getData);
      setTemplateList(resultCategory.data.data.result);
      setCurrentPage(resultCategory.data.data.currentPage);
      setTotalPages(resultCategory.data.data.totalPages);
      setPageSize(resultCategory.data.data.pageSize);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchAppData = async () => {
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
  const fetchTemplateList = async () => {
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
        "&&searchApp=" +
        searchApp +
        "&&searchApproved=" +
        searchApproved;
      UseGetTemplate(getData)
        .then((result) => {
          setTemplateList(result.data.data.result);
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
  const debouncedFetchTemplateList = debounce(fetchTemplateList, 300);
  const debouncedfetchAppData = debounce(fetchAppData, 300);
  const debouncedfetchData = debounce(fetchData, 300);
  useEffect(() => {
    try {
      // Handle other data values as needed
      debouncedfetchAppData();
      debouncedFetchTemplateList();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);
  useEffect(() => {
    try {
      // Handle other data values as needed
      debouncedFetchTemplateList();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [currentPage, pageSize, searchApp, searchApproved]);
  const columnsName = [
    { label: "Template Name", value: "template_name" },
    { label: "Category Name", value: "category_name" },
    { label: "Status", value: "is_active" },
    { label: "Is Free", value: "is_free" },
    { label: "Approved Status", value: "is_approved" },
  ];
  const columns = [
    {
      name: "App Name",
      selector: (row: Template) => row?.app_id?.app_name,
      sortable: true,
    },
    {
      name: "Category Name",
      selector: (row: Template) => row.category_name,
      sortable: true,
    },
    {
      name: "Template Name",
      selector: (row: Template) => row.template_name,
      sortable: true,
      cell: (row: Template) => (
        <Link
          className="text-blue-300 hover:text-red block text-sm"
          href={"template/" + row._id}
        >
          {row.template_name != undefined ? row.template_name : row._id}
        </Link>
      ),
    },
    {
      name: "Is Free",
      selector: (row: Template) => row.is_free,
      sortable: true,
    },
    {
      name: "Approved Status",
      selector: (row: Template) => TemplateStatus[row?.is_approved],
      sortable: true,
    },
    {
      name: "Status",
      selector: (row: Template) => (row.is_active == 1 ? "Active" : "Inactive"),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row: Template) =>
        row.is_approved == "Approved" || row.is_approved == "Declined" ? (
          <div>
            <button
              className="bg-red-700 rounded-sm text-white py-.8 px-1 text-sm m-1"
              onClick={() => {
                setOpenModal(true);
                setTemplateId(row._id);
                setActionType("Delete");
              }}
            >
              Delete
            </button>
          </div>
        ) : (
          <div style={{ width: 400 }}>
            <button
              className="bg-gray-700 rounded-sm text-white py-.8 px-1 text-sm m-1"
              onClick={() => {
                setTemplateactionurl(
                  getEndpointUrl(
                    ENDPOINTS.templates + ENDPOINTS.declinetemplate(),
                  ),
                );
                setTemplateId(row._id);
                setOpenModal(true);
                setActionType("Decline");
              }}
            >
              Decline
            </button>
            <button
              className="bg-green-700 rounded-sm text-white py-.8 px-1 text-sm m-1"
              onClick={() => {
                setTemplateactionurl(
                  getEndpointUrl(
                    ENDPOINTS.templates + ENDPOINTS.approvetemplate(),
                  ),
                );
                setTemplateId(row._id);
                setOpenModal(true);
                setActionType("Approve");
              }}
            >
              Approved
            </button>
            <button
              className="bg-red-700 rounded-sm text-white py-.8 px-1 text-sm m-1"
              onClick={() => {
                setOpenModal(true);
                setTemplateId(row._id);
                setActionType("Delete");
              }}
            >
              Delete
            </button>
          </div>
        ),
    },
  ];
  async function ActionTemplate() {
    try {
      // Handle other data values as needed
      await UseActionTemplate(templateactionurl, { template_id: templateId });
      debouncedfetchData();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setTemplateId("");
    setTemplateactionurl("");
    setActionType("");
  }

  async function deleteTemplate() {
    try {
      if (templateId != "") {
        // Handle other data values as needed
        await UseDeleteTemplate(templateId);
        const updatedItems = templateList.filter(
          (item: Template) => item._id !== templateId,
        );
        setTemplateList([...updatedItems]);
        if (updatedItems.length == 0) {
          if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
          }
        }
        debouncedfetchData();
      }
      setTemplateId("");
      setTemplateactionurl("");
      setActionType("");
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
      label: PATH.TemplateList.name,
      path: PATH.TemplateList.path,
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
              <h1 className="font-bold text-gray-900 header-font">Template</h1>
            </div>
            <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-start">
              <select
                id="app_id"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => {
                  setSearchApp(e.target.value);
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
              <select
                id="approved_status"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                onChange={(e) => {
                  setSearchApproved(e.target.value);
                  setCurrentPage(1);
                  setPageSize(10);
                }}
              >
                <option key={0} value="">
                  {"Select Approved Status"}
                </option>
                <option key={"Approved"} value="Approved">
                  {"Approved"}
                </option>
                <option key={"Declined"} value="Declined">
                  {"Declined"}
                </option>
              </select>
            </div>
            <div className="mt-4 flex flex-col gap-4 sm:mt-0 sm:flex-row sm:items-start">
              <Link href={PATH.AddTemplate.path}>
                <button
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-5 py-2 text-blue-300 transition hover:bg-gray-50 hover:text-blue-400 focus:outline-none"
                  type="button"
                >
                  Add Template
                </button>
              </Link>
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
          setTemplateId("");
          setTemplateactionurl("");
          setActionType("");
        }}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to {actiontype} this Template?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  setOpenModal(false);
                  actiontype == "Delete" ? deleteTemplate() : ActionTemplate();
                }}
              >
                {"Yes, I'm sure"}
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  setOpenModal(false);
                  setTemplateId("");
                  setTemplateactionurl("");
                  setActionType("");
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

export default TemplateListForm;
