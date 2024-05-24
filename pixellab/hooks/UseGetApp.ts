import axios from "axios";
import Cookies from "js-cookie";

const UseGetApp = async (url: string) => {
  try {
    const admintoken = Cookies.get("admintoken");

    const response = await axios.get(url, {
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
export default UseGetApp;
