import { getReportsByStatusAndReportedId } from "../api/reportApi";
import { useEffect, useState } from "react";

export const useRecipientReport = (status, reportedId) => {
  const [recipientReport, setRecipientReport] = useState([]);

  console.log(status, reportedId);
  console.log(recipientReport);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await getReportsByStatusAndReportedId(
          status,
          reportedId
        );
        setRecipientReport(response.data.data);
      } catch (error) {
        console.log("Failed to fetch data: ", error);
      }
    };

    fetchReports();
  }, [status, reportedId]);

  return { recipientReport };
};
