"use strict";

import axios, { AxiosResponse } from "axios";
import { EMAIL, API_KEY, API_ENDPOINT } from "../config";

interface UserResponse {
  result: { id: string };
}

async function getUserId(): Promise<string> {
  try {
    const response: AxiosResponse<UserResponse> = await axios.get(
      `${API_ENDPOINT}/user`,
      {
        headers: getRequestHeaders(),
      }
    );

    const userId = response.data.result.id;

    if (userId === "null") {
      throw new Error("Failed API auth.");
    }

    return userId;
  } catch (error: any) {
    throw new Error(`Error getting user ID: ${error.message}`);
  }
}

function getRequestHeaders() {
  return {
    "X-Auth-Email": EMAIL,
    "X-Auth-Key": API_KEY,
    "Content-Type": "application/json",
  };
}

export default getUserId;
