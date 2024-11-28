import { useRecipientReport } from "../../hook/useRecipientReport";
import React from "react";
import { Tag } from "antd";

function ReportUser({ user }) {
  const { recipientReport } = useRecipientReport("WARNING", user._id);

  console.log(recipientReport);

  return (
    <div>
      <td>
        {recipientReport.length > 5 ? (
          <Tag color="red">Nguy hiểm</Tag>
        ) : recipientReport.length > 2 ? (
          <Tag color="yellow">Cảnh báo</Tag>
        ) : (
          <Tag color="green">An toàn</Tag>
        )}
        <p
          className="text-muted"
          style={{
            fontSize: "12px",
            margin: "0",
            padding: "0",
          }}
        >
          Vi phạm: {recipientReport.length}
        </p>
      </td>
    </div>
  );
}

export default ReportUser;
