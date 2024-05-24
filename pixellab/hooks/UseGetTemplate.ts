import { getEndpointUrl, ENDPOINTS } from "@/constants/endpoints";
import axios from "axios";
import Cookies from "js-cookie";
const UseGetTemplate = async (postdata: string) => {
  const url = getEndpointUrl(ENDPOINTS.templates);
  const admintoken = Cookies.get("admintoken");
  try {
    const response = await axios.get(url + postdata, {
      headers: {
        Authorization: `Bearer ${admintoken}`,
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
export default UseGetTemplate;
