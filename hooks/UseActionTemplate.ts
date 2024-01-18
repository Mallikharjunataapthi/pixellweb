import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
const UseActionTemplate = async (url: string, data: {}): Promise<void> => {
  const admintoken = Cookies.get("admintoken");
  try {
    await axios.patch(url, data, {
      headers: {
        Authorization: `Bearer ${admintoken}`,
        // Add any other headers if needed
      },
    });
  } catch (error: any) {
  } finally {
  }
};

export default UseActionTemplate;
