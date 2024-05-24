import { getEndpointUrl, ENDPOINTS } from "@/constants/endpoints";
import axios from "axios";
import Cookies from "js-cookie";
const UseGetUserById = async (userId: number) => {
  const admintoken = Cookies.get("admintoken");
  const url = getEndpointUrl(ENDPOINTS.users + "/" + userId);
  try {
    const response = await axios.get(url, {
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
export default UseGetUserById;
