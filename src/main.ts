"use strict";

import getUserId from "./lib/getUserId";
import getDomains from "./lib/getDomains";
import { updateDnsRecords } from "./lib/updateRecords";

(async () => {
  try {
    const userId = await getUserId();
    const domains = await getDomains();

    for (const domain of domains)
      if (domain !== "as393577.net") await updateDnsRecords(domain);
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
  }
})();
