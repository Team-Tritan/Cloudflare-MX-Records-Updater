"use strict";

import axios, { AxiosResponse } from "axios";
import { EMAIL, API_KEY, API_ENDPOINT } from "../config";

interface Zone {
  id: string;
  name: string;
}

export interface ZoneResponse {
  result: Zone[];
}

async function getDomains(): Promise<string[]> {
  try {
    const response: AxiosResponse<ZoneResponse> = await axios.get(
      `${API_ENDPOINT}/zones`,
      {
        headers: getRequestHeaders(),
      }
    );

    const domains = response.data.result.map(({ name }) => name);

    return domains;
  } catch (error: any) {
    throw new Error(`Error getting domains: ${error.message}`);
  }
}

function getRequestHeaders() {
  return {
    "X-Auth-Email": EMAIL,
    "X-Auth-Key": API_KEY,
    "Content-Type": "application/json",
  };
}

export default getDomains;
