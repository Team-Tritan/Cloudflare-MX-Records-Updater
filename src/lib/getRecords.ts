"use strict";

import axios, { AxiosResponse } from "axios";
import { EMAIL, API_KEY, API_ENDPOINT } from "../config";

export interface DnsRecord {
  id: string;
  type: string;
  name: string;
  content: string;
}

interface DnsRecordResponse {
  result: DnsRecord[];
}

async function getDnsRecords(
  zoneId: string,
  type: string,
  name: string
): Promise<DnsRecord[]> {
  try {
    const response = await axios.get<DnsRecordResponse>(
      `${API_ENDPOINT}/zones/${zoneId}/dns_records?type=${type}&name=${name}`,
      {
        headers: getRequestHeaders(),
      }
    );

    return response.data.result;
  } catch (error: any) {
    throw new Error(`Error getting DNS records: ${error.message}`);
  }
}

function getRequestHeaders() {
  return {
    "X-Auth-Email": EMAIL,
    "X-Auth-Key": API_KEY,
    "Content-Type": "application/json",
  };
}

export default getDnsRecords;
