import nodemailer from 'nodemailer'
import env_config from '~/configs/env.config'
import { ACCOUNT_TYPE, ROLE_TYPE } from '~/enums/user.enum'
import { PAYMENT_SCHEMA } from '~/models/schemas/Payment.schema'
import { USER_SCHEMA } from '~/models/schemas/User.schema'
import { VIP_PACKAGE_SCHEMA } from '~/models/schemas/VipPackage.schema'
import { formatCurrency, handlePriceDiscount } from './formatCurrency'
import { DISCOUNT_TYPE } from '~/enums/util.enum'
import { capitalize } from 'lodash'
import { VIP_USER_DETAIL_SCHEMA } from '~/models/schemas/VipUserDetail.schema'
import { PHOTO_NEW_SCHEMA } from '~/models/schemas/PhotoNew.schema'
import e from 'express'

export const sendEmailVerification = async (
  email: string,
  token: string,
  subject: string,
  account_type: ACCOUNT_TYPE,
  role: ROLE_TYPE
) => {
  try {
    const verificationLink = `${env_config.CLIENT_PORTS}/verify-email?token=${token}&account_type=${account_type}&role=${role}`
    const htmlContent = `
         <p>Xin chào,</p>
<p>Cảm ơn bạn đã đăng ký tài khoản! Vui lòng sử dụng liên kết xác minh sau để kích hoạt tài khoản của bạn:</p>

<a href="${verificationLink}"
   style="display: inline-block;
          background-color: #edf2f7; /* Tương đương với bg-gray-200 trong Tailwind */
          color: #2d3748; /* Tương đương với text-white trong Tailwind */
          font-weight: bold;
          padding: 0.5rem 1rem; /* Tương đương với py-2 px-4 trong Tailwind */
          border-radius: 50px; /* Tương đương với rounded-full trong Tailwind */
          text-decoration: none;
          transition: background-color 0.3s ease; /* Tương đương với hover:bg-gray-300 trong Tailwind */
          "
   onmouseover="this.style.backgroundColor='#cbd5e0'"
   onmouseout="this.style.backgroundColor='#edf2f7'"
>
    Xác nhận
</a>

<p>Nhấp vào liên kết ở trên hoặc sao chép và dán nó vào thanh địa chỉ trình duyệt để hoàn tất quá trình xác minh và kích hoạt tài khoản của bạn.</p>

<p>Nếu bạn không đăng ký dịch vụ này, vui lòng bỏ qua email này.</p>


        `
    const transporter = nodemailer.createTransport({
      host: env_config.EMAIL_HOST,
      service: env_config.EMAIL_SERVICE,
      port: Number(env_config.EMAIL_PORT),
      secure: Boolean(env_config.EMAIL_SERCURE),
      auth: {
        user: env_config.EMAIL_AUTH_USER,
        pass: env_config.EMAIL_AUTH_PASS
      }
    })
    return await transporter.sendMail({
      from: env_config.EMAIL_AUTH_USER,
      to: email,
      subject: subject,
      html: htmlContent
    })
  } catch (error) {
    console.log(error)
  }
}
// export const sendEmailResetPassword = async ({
//   email,
//   token,
//   subject,
//   account_type,
//   role
// }: {
//   email: string
//   token: string
//   subject: string
//   account_type: ACCOUNT_TYPE
//   role: ROLE_TYPE
// }) => {
//   try {
//     const resetPasswordLink = `${env_config.CLIENT_PORTS}/reset-password/${token}?account_type=${account_type}&role=${role}`
//     const htmlContent = `
//     <p>Xin chào,</p>
//     <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng liên kết sau để đặt lại mật khẩu của bạn:</p>

//     <a href="${resetPasswordLink}"
//        style="display: inline-block;
//               background-color: #edf2f7; /* Tương đương với bg-gray-200 trong Tailwind */
//               color: #2d3748; /* Tương đương với text-gray-800 trong Tailwind */
//               font-weight: bold;
//               padding: 0.5rem 1rem; /* Tương đương với py-2 px-4 trong Tailwind */
//               border-radius: 50px; /* Tương đương với rounded-full trong Tailwind */
//               text-decoration: none;
//               transition: background-color 0.3s ease; /* Tương đương với hover:bg-gray-300 trong Tailwind */
//               "
//        onmouseover="this.style.backgroundColor='#cbd5e0'"
//        onmouseout="this.style.backgroundColor='#edf2f7'"
//     >
//         Đặt lại mật khẩu
//     </a>

//     <p>Nhấp vào liên kết ở trên hoặc sao chép và dán nó vào thanh địa chỉ trình duyệt để hoàn tất quá trình đặt lại mật khẩu của bạn.</p>

//     <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>

//     <p>Trân trọng.</p>
// `
//     const transporter = nodemailer.createTransport({
//       host: env_config.EMAIL_HOST,
//       service: env_config.EMAIL_SERVICE,
//       port: Number(env_config.EMAIL_PORT),
//       secure: Boolean(env_config.EMAIL_SERCURE),
//       auth: {
//         user: env_config.EMAIL_AUTH_USER,
//         pass: env_config.EMAIL_AUTH_PASS
//       }
//     })
//     return await transporter.sendMail({
//       from: env_config.EMAIL_AUTH_USER,
//       to: email,
//       subject: subject,
//       html: htmlContent
//     })
//   } catch (error) {
//     console.log(error)
//   }
// }

// send otp to email for reset password, otp random 6 number
export const sendEmailResetPassword = async ({
  email,
  otp,
  subject,
  account_type,
  role
}: {
  email: string
  otp: number
  subject: string
  account_type: ACCOUNT_TYPE
  role: ROLE_TYPE
}) => {
  try {
    const htmlContent = `
    <p>Xin chào,</p>
    <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Mã OTP của bạn là: <strong>${otp}</strong></p>
    <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
    <p>Trân trọng.</p>
`
    const transporter = nodemailer.createTransport({
      host: env_config.EMAIL_HOST,
      service: env_config.EMAIL_SERVICE,
      port: Number(env_config.EMAIL_PORT),
      secure: Boolean(env_config.EMAIL_SERCURE),
      auth: {
        user: env_config.EMAIL_AUTH_USER,
        pass: env_config.EMAIL_AUTH_PASS
      }
    })
    return await transporter.sendMail({
      from: env_config.EMAIL_AUTH_USER,
      to: email,
      subject: subject,
      html: htmlContent
    })
  } catch (error) {
    console.log(error)
  }
}

export const sendEmailSignVipSuccess = async ({
  user,
  payment,
  vip_package,
  vip_detail,
  subject
}: {
  user: USER_SCHEMA
  payment: PAYMENT_SCHEMA
  vip_package: VIP_PACKAGE_SCHEMA
  vip_detail: VIP_USER_DETAIL_SCHEMA
  subject: string
}) => {
  try {
    //     const htmlContent = `<!DOCTYPE html>
    // <html lang="en">
    // <head>
    //     <meta charset="UTF-8">
    //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //     <title>Đăng Ký VIP Thành Công</title>
    //     <style>
    //         body {
    //             font-family: 'Arial', sans-serif;
    //             background-color: #f4f4f4;
    //             margin: 0;
    //             display: flex;
    //             justify-content: center;
    //             align-items: center;
    //             height: 100vh;
    //         }

    //         .container {
    //             background-color: white;
    //             padding: 30px;
    //             border-radius: 10px;
    //             box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    //             max-width: 600px;
    //             text-align: center;
    //         }

    //         h1 {
    //             color: #4CAF50;
    //             font-size: 24px;
    //             margin-bottom: 20px;
    //         }

    //         p {
    //             font-size: 18px;
    //             margin-bottom: 20px;
    //         }

    //         table {
    //             width: 100%;
    //             border-collapse: collapse;
    //             margin-bottom: 20px;
    //         }

    //         th, td {
    //             padding: 12px;
    //             border: 1px solid #ddd;
    //             text-align: left;
    //         }

    //         th {
    //             background-color: #f2f2f2;
    //         }

    //         .button {
    //             display: inline-block;
    //             padding: 10px 20px;
    //             background-color: #4CAF50;
    //             color: white;
    //             text-decoration: none;
    //             border-radius: 5px;
    //             font-size: 16px;
    //         }

    //         .button:hover {
    //             background-color: #45a049;
    //         }
    //     </style>
    // </head>
    // <body>
    //     <div class="container">
    //         <h1>Đăng Ký VIP Thành Công!</h1>
    //         <p>Cảm ơn bạn đã đăng ký gói VIP của chúng tôi.</p>
    //         <table>
    //             <tr>
    //                 <th>Thông tin tài khoản</th>
    //                 <td></td>
    //             </tr>
    //             <tr>
    //                 <td><strong>Tên:</strong></td>
    //                 <td>${user.full_name}</td>
    //             </tr>
    //             <tr>
    //                 <td><strong>Email:</strong></td>
    //                 <td>${user.email}</td>
    //             </tr>
    //             <tr>
    //                 <th>Chi tiết gói VIP</th>
    //                 <td></td>
    //             </tr>
    //             <tr>
    //                 <td><strong>Giá gói VIP:</strong></td>
    //                 <td>${formatCurrency(vip_package.price)}</td>
    //             </tr>
    //             <tr>
    //                 <td><strong>Giảm giá:</strong></td>
    //                 <td>${vip_package.discount.discountPercentage + '%'}</td>
    //             </tr>
    //             <tr>
    //                 <td><strong>Thành tiền:</strong></td>
    //                 <td>${formatCurrency(handlePriceDiscount(vip_package.price, vip_package.discount))}</td>
    //             </tr>
    //             <tr>
    //                 <td><strong>Kỳ thanh toán tiếp theo:</strong></td>
    //                 <td>${new Date(vip_detail.end_date).toLocaleDateString('vi-VN')}</td>
    //             </tr>
    //             <tr>
    //                 <td><strong>Phương thức thanh toán:</strong></td>
    //                 <td>${capitalize(payment.payment_method)}</td>
    //             </tr>
    //         </table>
    //         <a href="${env_config.CLIENT_PORTS}" class="button">Quay về trang chủ</a>
    //     </div>
    // </body>
    // </html>

    // `
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng ký VIP Thành công</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 500px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
        }

        h1 {
            text-align: center;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        .footer {
            margin-top: 50px;
            text-align: center;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Đăng ký VIP Thành công</h1>
        
        <div class="account-info">
            <h2>Thông tin tài khoản</h2>
            <table>
                <tr>
                    <th>Họ và Tên</th>
                    <td>${user.full_name}</td>
                </tr>
                <tr>
                    <th>Email</th>
                    <td>${user.email}</td>
                </tr>
            </table>
        </div>

        <div class="package-info">
            <h2>Chi tiết gói VIP</h2>
            <table>
                <tr>
                    <th>Tên gói</th>
                    <td>${vip_package.packageName}</td>
                </tr>
                <tr>
                    <th>Giá</th>
                    <td>${formatCurrency(vip_package.price)}</td>
                </tr>
                <tr>
                    <th>Giảm giá</th>
                    <td>${vip_package.discount.discountPercentage + '%'}</td>
                </tr>
                <tr>
                    <th>Thành tiền</th>
                    <td>${formatCurrency(handlePriceDiscount(vip_package.price, vip_package.discount))}</td>
                </tr>
                <tr>
                    <th>Kỳ thanh toán tiếp theo</th>
                    <td>${new Date(vip_detail.end_date).toLocaleDateString('vi-VN')}</td>
                </tr>
                <tr>
                    <th>Phương thức thanh toán</th>
                    <td>${capitalize(payment.payment_method)}</td>
                </tr>
            </table>
        </div>

        <a href="${env_config.CLIENT_PORTS}">Quay về trang chủ</a>
    </div>

    <div class="footer">
        <p>PhotoGUY - 3/2, Quận Ninh Kiều, Tp.Cần Thơ</p>
    </div>
</body>
</html>
`
    const transporter = nodemailer.createTransport({
      host: env_config.EMAIL_HOST,
      service: env_config.EMAIL_SERVICE,
      port: Number(env_config.EMAIL_PORT),
      secure: Boolean(env_config.EMAIL_SERCURE),
      auth: {
        user: env_config.EMAIL_AUTH_USER,
        pass: env_config.EMAIL_AUTH_PASS
      }
    })
    return await transporter.sendMail({
      from: env_config.EMAIL_AUTH_USER,
      to: user.email,
      subject: subject,
      html: htmlContent
    })
  } catch (error) {
    console.log(error)
  }
}

export const sendEmailWarningVipExpire = async ({
  user,
  vip_package,
  vip_detail,
  subject
}: {
  user: USER_SCHEMA
  vip_package: VIP_PACKAGE_SCHEMA
  vip_detail: VIP_USER_DETAIL_SCHEMA
  subject: string
}) => {
  try {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #dddddd;
            border-radius: 5px;
        }
        .header {
            background-color: #4CAF50;
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 5px 5px 0 0;
            text-align: center;
        }
        .content {
            padding: 20px;
            line-height: 1.6;
        }
        .content h2 {
            color: #333333;
        }
        .content p {
            color: #666666;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #4CAF50;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #999999;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Thông báo sắp hết hạn gói VIP</h1>
        </div>
        <div class="content">
            <h2>Xin chào ${user.full_name},</h2>
            <p>Chúng tôi muốn thông báo rằng gói VIP của bạn sẽ hết hạn vào ngày <strong>${new Date(vip_detail.end_date).toLocaleDateString('vi-VN')}</strong>.</p>
            <p>Để tiếp tục tận hưởng các quyền lợi của gói VIP, vui lòng gia hạn gói của bạn trước ngày hết hạn.</p>
            <a href="${env_config.CLIENT_PORTS + `/renew?package_id=${vip_package._id}`}" class="button">Gia hạn ngay</a>
        </div>
        <div class="footer">
            <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi tại <a href="mailto:support@example.com">support@example.com</a>.</p>
            <p>Trân trọng,<br>Đội ngũ Hỗ trợ Khách hàng</p>
        </div>
    </div>
</body>
</html>
`
    const transporter = nodemailer.createTransport({
      host: env_config.EMAIL_HOST,
      service: env_config.EMAIL_SERVICE,
      port: Number(env_config.EMAIL_PORT),
      secure: Boolean(env_config.EMAIL_SERCURE),
      auth: {
        user: env_config.EMAIL_AUTH_USER,
        pass: env_config.EMAIL_AUTH_PASS
      }
    })
    return await transporter.sendMail({
      from: env_config.EMAIL_AUTH_USER,
      to: user.email,
      subject: subject,
      html: htmlContent
    })
  } catch (error) {
    console.log(error)
  }
}

export const sendEmailReportSuccess = async ({
  user,
  photo,
  subject
}: {
  user: USER_SCHEMA
  photo: PHOTO_NEW_SCHEMA
  subject: string
}) => {
  try {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #dddddd;
            border-radius: 5px;
        }
        .header {
            background-color: #4CAF50;
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 5px 5px 0 0;
            text-align: center;
        }
        .content {
            padding: 20px;
            line-height: 1.6;
        }
        .content h2 {
            color: #333333;
        }
        .content p {
            color: #666666;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #4CAF50;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #999999;
            font-size: 12px;
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="header">
            <h1>Báo cáo thành công</h1>
        </div>
        <div class="content">
            <h2>Xin chào ${user.full_name},</h2>
            <p>Chúng tôi đã nhận được báo cáo của bạn về bài viết <strong>${photo.title}</strong>.</p>
            <p>Chúng tôi sẽ kiểm tra và xử lý bài viết sớm nhất có thể.</p>
            <p>Cảm ơn bạn đã giúp chúng tôi xây dựng một cộng đồng an toàn và lành mạnh.</p>
        </div>
        <div class="footer">
              <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi tại <a href="mailto:support@example.com">support@example.com</a>.</p>

            <p>Trân trọng,<br>Đội ngũ hỗ trợ khách hàng</p>


        </div>
    </div>
</body>
</html>
`
    const transporter = nodemailer.createTransport({
      host: env_config.EMAIL_HOST,
      service: env_config.EMAIL_SERVICE,
      port: Number(env_config.EMAIL_PORT),
      secure: Boolean(env_config.EMAIL_SERCURE),
      auth: {
        user: env_config.EMAIL_AUTH_USER,
        pass: env_config.EMAIL_AUTH_PASS
      }
    })
    return await transporter.sendMail({
      from: env_config.EMAIL_AUTH_USER,
      to: user.email,
      subject: subject,
      html: htmlContent
    })
  } catch (error) {
    console.log(error)
  }
}
export const sendEmailReportProcessPunishment = async ({
  user,
  photo,
  subject
}: {
  user: USER_SCHEMA
  photo: PHOTO_NEW_SCHEMA
  subject: string
}) => {
  try {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #dddddd;
            border-radius: 5px;
        }
        .header {
            background-color: #4CAF50;
            color: #ffffff;
            padding: 10px 20px;
            border-radius: 5px 5px 0 0;
            text-align: center;
        }
        .content {
            padding: 20px;
            line-height: 1.6;
        }
        .content h2 {
            color: #333333;
        }
        .content p {
            color: #666666;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #4CAF50;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            color: #999999;
            font-size: 12px;
        }
    </style>
</head>


<body>
    <div class="email-container">
        <div class="header">
            <h1>Thông báo xử lý vi phạm</h1>
        </div>
        <div class="content">
            <h2>Xin chào ${user.full_name},</h2>
            <p>Chúng tôi đã xử lý bài viết <strong>${photo.title}</strong> của bạn.</p>
            <p>Bài viết của bạn đã vi phạm quy định của chúng tôi và đã bị gỡ khỏi hệ thống.</p>
            <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi tại <a href="mailto:${env_config.EMAIL_AUTH_USER}">${env_config.EMAIL_AUTH_USER}</a>.</p>

        </div>
        <div class="footer">
            <p>Trân trọng,<br>Đội ngũ hỗ trợ khách hàng</p>
        </div>
    </div>
</body>
</html>
`
    const transporter = nodemailer.createTransport({
      host: env_config.EMAIL_HOST,
      service: env_config.EMAIL_SERVICE,
      port: Number(env_config.EMAIL_PORT),
      secure: Boolean(env_config.EMAIL_SERCURE),
      auth: {
        user: env_config.EMAIL_AUTH_USER,
        pass: env_config.EMAIL_AUTH_PASS
      }
    })
    return await transporter.sendMail({
      from: env_config.EMAIL_AUTH_USER,
      to: user.email,
      subject: subject,
      html: htmlContent
    })
  } catch (error) {
    console.log(error)
  }
}
