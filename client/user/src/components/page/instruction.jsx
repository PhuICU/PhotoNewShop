import React from "react";
import { Link } from "react-router-dom";

function Instruction() {
  return (
    <div className="instruction container mt-4">
      <h1>Hướng dẫn đăng tin trên máy tính</h1>
      <hr />
      <h6>Bạn có thể dễ dàng đăng tin trên máy với các bước sau</h6>
      <div className="mt-4">
        <p>
          <span className="fw-bold">Bước 1:</span> Đăng nhập vào tài khoản
          website của bạn
        </p>
        Nếu bạn chưa có tài khoản, hãy đăng ký tài khoản mới{" "}
        <Link to={"/register"} className="text-danger fw-bolder">
          tại đây
        </Link>
      </div>
      <div className="mt-4">
        <p>
          <span className="fw-bold">Bước 2:</span> Bấm vào nút{" "}
          <span className="text-danger">Đăng tin</span> ở góc phải trên website
          hoặc trong hồ sơ cá nhân của bạn
        </p>
      </div>
      <div className="mt-4">
        <p>
          <span className="fw-bold">Bước 3:</span> Trên giao diện đăng tin điền
          thông tin bất động sản vào các mục: Thông tin cơ bản, thông tin bài
          viết, thông tin bất động sản, Hình ảnh & Video, Thông tin liên hệ,
          loại tin đăng, thời gian hiển thị,... như sau:
        </p>
        <div className="container">
          <p>
            <span className="fw-bold">Lưu ý:</span>
          </p>
          <p>
            - Các ô có dấu <span className="text-danger">*</span> là thông tin
            bắt buộc phải điền.
          </p>
          <p>
            - Bạn nên điền đủ thông tin vào các ô để tối ưu hiệu quả tin đăng,
            công cụ tìm kiếm, cũng như bảo đảm cung cấp đầy đủ thông tin cho
            người xem tin.
          </p>
          <p>
            <span className="fw-bold">Thông tin cơ bản:</span>
          </p>
          <p>
            Bạn lưu ý chọn đúng loại tin cần đăng:{" "}
            <span className="text-danger">
              Máy ảnh/ Máy quay/ Ống kính/ Phụ kiện
            </span>
          </p>
          <p>
            <span className="fw-bold">Thông tin bài viết:</span>
          </p>
          <p>
            - Tiêu đề: Bạn nên điền tiêu đề rõ ràng, ngắn gọn, dễ hiểu, thu hút
            người xem.
          </p>
          <p>
            - Mô tả: Bạn nên mô tả chi tiết, rõ ràng, chính xác về bất động sản
            cần đăng, cũng như các thông tin khác liên quan.
          </p>
          <p>
            <span className="fw-bold">Ví dụ:</span>
          </p>
          <div className="container">
            <p>Máy ảnh canon 1ds2.</p>
            <p>Ngoại hình khá, chụp tốt, kính ngắm dạch đẹp.</p>
            <p>Tất cả các nút đều tốt.</p>
            <p>
              Đi kèm sạc zin, 1 pin kingma (còn bảo hành 10 tháng), 1 thẻ sd
              32g.
            </p>
            <p>Liên hệ: Ms Hoa 09xx xxx xxx</p>
          </div>

          <p>
            <span className="fw-bold">Thông tin máy:</span>
          </p>
          <p>
            <span className="fst-italic">Lưu ý:</span>
          </p>
          <div className="container">
            <p>
              - Mức giá mặc định theo đơn vị tiền tệ Việt Nam - VNĐ. Mức giá
              không được để trống, nếu không để giá, bạn vui lòng chọn "Thỏa
              thuận"
            </p>
          </div>

          <p>
            <span className="fw-bold">Hình ảnh & Video:</span>
          </p>
          <div className="container">
            <p>
              - Tin đăng có hình ảnh và video kèm theo sẽ tăng thêm sự hấp dẫn,
              sự tin tưởng của khách hàng và thu hút lượt xem.
            </p>
            <p>
              - Tin đăng có hình ảnh/ video sẽ được xuất hiện nhiều hơn trên
              website. Khi khách hàng tìm tin Xem trên bản đồ, tin sẽ hiển thị
              trên 3 tab: Tất cả tin đăng, Tin có ảnh & Tin có video.
            </p>
            <p>
              - Để đăng hình ảnh/ video, bạn dán link video từ youtube và tải
              ảnh tại đây:
            </p>
          </div>

          <p>
            <span className="fst-italic">Lưu ý</span>
          </p>
          <div className="container">
            <p>
              - Ảnh đầu tiên bạn chọn sẽ là ảnh đại diện trong danh sách tin
              đăng.
            </p>
            <p>
              - Hãy luôn sử dụng hình ảnh thật cho tin của bạn, không nên sử
              dụng hình ảnh copy, tìm kiếm qua internet.
            </p>
            <p>
              - Hình ảnh phải liên quan đến bất động sản miêu tả trong tin đăng
              và bảo đảm về chất lượng để người xem có thể dễ dàng hình dung về
              thiết bị.
            </p>
          </div>
          <p>
            <span className="fw-bold">Thông tin liên hệ:</span>
          </p>
          <div className="container">
            <p>
              Số điện thoại để trên tin đăng và thông tin liên hệ bạn cần xác
              thực vào tài khoản.
            </p>
            <p>
              Bấm vào <span className="text-danger">Thêm</span> để xác thực hoặc
              xem hướng dẫn xác thực số điện thoại tại đây. Nếu tài khoản đã xác
              thực số điện thoai, bạn bỏ qua bước này:
            </p>
          </div>
        </div>
      </div>
      <div>
        <p>
          <span className="fw-bold">Bước 4:</span> Kiểm tra và đăng tin
        </p>
        <div className="container">
          <p>
            Để kiểm tra lại tin đăng trước khi đăng. Sau đó bấm "
            <span className="text-danger">Đăng tin</span>" để hoàn thành việc
            đăng tin.
          </p>
          <p>
            Tin đăng thành công bạn sẽ nhận được "Mã tin". Bạn có thể xem và
            quản lý tin đăng tại "
            <span className="text-danger">Quản lý tin đăng</span>". Xem chi tiết
            các tính năng hỗ trợ đăng tin{" "}
            <Link to={"/profile"} className="text-danger fw-bolder">
              tại đây
            </Link>
            .
          </p>
        </div>
      </div>
      <div className="d-flex justify-content-center mt-4">
        <h5 className="fw-bold">
          Cảm ơn bạn đã quan tâm đến sản phẩm dịch vụ của Chúng tôi!
        </h5>
      </div>
    </div>
  );
}

export default Instruction;
