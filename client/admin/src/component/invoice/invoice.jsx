import React, { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function Invoice({ item }) {
  const invoiceRef = useRef();

  const handleGeneratePDF = async () => {
    const element = invoiceRef.current; // Reference to the invoice div
    const canvas = await html2canvas(element, { scale: 2 }); // Higher scale for better quality

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    // Get PDF dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Canvas dimensions
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // Calculate the number of pages needed
    let heightLeft = imgHeight;
    let position = 0;

    while (heightLeft > 0) {
      pdf.addImage(
        imgData,
        "PNG",
        0,
        position, // Position where the current page starts
        pdfWidth,
        (imgHeight * pdfWidth) / imgWidth // Scale image height to fit the page width
      );

      heightLeft -= pdfHeight * (imgWidth / pdfWidth); // Reduce remaining height
      position -= pdfHeight; // Move the next section upwards

      if (heightLeft > 0) {
        pdf.addPage(); // Add new page
      }
    }

    pdf.save("invoice.pdf");
  };

  return (
    <div className="">
      <div
        className="invoice-container container-fluid"
        ref={invoiceRef}
        style={{ width: "100%", height: "100%", padding: "40px" }}
      >
        <div className="header">
          <h2>Công Ty Photo GUY</h2>
          <p>Đường 3/2, quận Ninh Kiều, Tp Cần Thơ</p>
          <p>Điện thoại: (029) 0909 0909 - (032) 0120 2100</p>
        </div>
        <div className="invoice-details">
          <h4>Bảng Hóa Đơn</h4>
          <p>
            <strong>Số Hóa Đơn:</strong> #{Math.floor(Math.random() * 1000000)}
          </p>
          <p>
            <strong>Ngày:</strong> {new Date().toLocaleDateString("vi-VN")}
          </p>
        </div>
        <div className="customer-details">
          <h4>Thông Tin Chủ Quản</h4>
          <p>
            <strong>Tên:</strong> Nguyễn Văn A
          </p>
          <p>
            <strong>Địa chỉ:</strong> Đường 3/2, quận Ninh Kiều, Tp Cần Thơ
          </p>
          <p>
            <strong>Điện thoại:</strong> (0987) 654-321
          </p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Khách hàng</th>
              <th>Gói vip</th>
              <th>Phương thức</th>
              <th>Đơn giá</th>
            </tr>
          </thead>
          <tbody>
            {item && item.length > 0 ? (
              item.map((item) => (
                <tr key={item._id}>
                  <td>{item.user.full_name}</td>
                  <td>
                    {item.package ? item.package.packageName : "Gói đã bị xóa"}
                  </td>
                  <td>{item.payment_method}</td>
                  {console.log(item.package)}
                  <td>
                    {item.amount.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  Không tìm thấy dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="total">
          <h5>
            Tổng Cộng:{" "}
            {item
              .reduce((acc, curr) => acc + curr.amount, 0)
              .toLocaleString("it-IT", { style: "currency", currency: "VND" })}
          </h5>
        </div>
        <div className="footer mt-4">
          <p>© 2024 PHOTOGRAPHER GUY. All rights reserved.!</p>
        </div>
      </div>
      <div className="print-button-container">
        <button className="print-button" onClick={handleGeneratePDF}>
          Xuất PDF
        </button>
      </div>
    </div>
  );
}

export default Invoice;
