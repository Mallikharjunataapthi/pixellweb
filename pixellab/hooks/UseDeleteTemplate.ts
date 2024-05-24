import { getEndpointUrl, ENDPOINTS } from "@/constants/endpoints";
import axios from "axios";
import Cookies from "js-cookie";
const UseDeleteTemplate = async (templateId: string) => {
  const url = getEndpointUrl(ENDPOINTS.templates + "/" + templateId);
  const admintoken = Cookies.get("admintoken");
  try {
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${admintoken}`,
        // Add any other headers if needed
      },
    });

    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data);
      throw new Error(
        error.response?.data?.message ||
          "An error occurred while fetching the data",
      );
    } else {
      console.error(error);
      throw new Error("An error occurred while fetching the data");
    }
  }
};
export default UseDeleteTemplate;
