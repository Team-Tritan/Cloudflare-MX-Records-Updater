"use strict";

import axios, { AxiosResponse } from "axios";
import { API_KEY, API_ENDPOINT, EMAIL, NEW_MX, NEW_SPF } from "../config";
import getDnsRecords, { DnsRecord } from "./getRecords";
import { ZoneResponse } from "./getDomains";

async function updateMxRecord(
  zoneId: string,
  domain: string,
  currentMx: DnsRecord | null
): Promise<void> {
  try {
    if (currentMx) {
      if (currentMx.content !== NEW_MX) {
        await axios.put(
          `${API_ENDPOINT}/zones/${zoneId}/dns_records/${currentMx.id}`,
          {
            type: "MX",
            name: domain,
            content: NEW_MX,
            priority: 10,
            ttl: 1,
            proxied: false,
          },
          getRequestHeaders()
        );
        console.log(`Updated MX record for ${domain}`);
      } else {
        console.log(`MX record for ${domain} is already ${NEW_MX}`);
      }
    } else {
      await axios.post(
        `${API_ENDPOINT}/zones/${zoneId}/dns_records`,
        {
          type: "MX",
          name: domain,
          content: NEW_MX,
          priority: 10,
          ttl: 1,
          proxied: false,
        },
        getRequestHeaders()
      );
      console.log(`Added MX record for ${domain}`);
    }
  } catch (error: any) {
    throw new Error(`Error updating MX record for ${domain}: ${error.message}`);
  }
}

async function updateSpfRecord(
  zoneId: string,
  domain: string,
  currentSpf: DnsRecord | null
): Promise<void> {
  try {
    if (!currentSpf) {
      await axios.post(
        `${API_ENDPOINT}/zones/${zoneId}/dns_records`,
        {
          type: "TXT",
          name: "@",
          content: NEW_SPF,
          ttl: 1,
          proxied: false,
        },
        getRequestHeaders()
      );
      console.log(`Added SPF record for ${domain}`);
    } else if (currentSpf.content.startsWith("v=spf1")) {
      await axios.put(
        `${API_ENDPOINT}/zones/${zoneId}/dns_records/${currentSpf.id}`,
        {
          type: "TXT",
          name: "@",
          content: NEW_SPF,
          ttl: 1,
          proxied: false,
        },
        getRequestHeaders()
      );
      console.log(`Updated SPF record for ${domain}`);
    }
  } catch (error: any) {
    throw new Error(
      `Error updating SPF record for ${domain}: ${error.message}`
    );
  }
}

async function updateDnsRecords(domain: string): Promise<void> {
  try {
    const zoneResponse: AxiosResponse<ZoneResponse> = await axios.get(
      `${API_ENDPOINT}/zones?name=${domain}`,
      getRequestHeaders()
    );

    const zoneId = zoneResponse.data.result[0]?.id;

    if (!zoneId) {
      console.error(`Error: Unable to fetch Zone ID for ${domain}. Skipping.`);
      return;
    }

    const [currentMx, currentSpf] = await Promise.all([
      getDnsRecords(zoneId, "MX", domain).then((records) => records[0] || null),
      getDnsRecords(zoneId, "TXT", domain).then(
        (records) => records[0] || null
      ),
    ]);

    await updateMxRecord(zoneId, domain, currentMx);
    await updateSpfRecord(zoneId, domain, currentSpf);
  } catch (error: any) {
    console.error(`Error updating records for ${domain}: ${error.message}`);
  }
}

function getRequestHeaders() {
  return {
    headers: {
      "X-Auth-Email": EMAIL,
      "X-Auth-Key": API_KEY,
      "Content-Type": "application/json",
    },
  };
}

export { updateDnsRecords, updateMxRecord, updateSpfRecord };
