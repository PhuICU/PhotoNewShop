import nodemailer from "nodemailer";

export const sendMail = async (user, subject, text) => {
  try {
    const htmlContent = `
      <div>
        <h1>Gửi về trang PhotoGUY</h1>
        <p>${text}</p>
      </div>
    `;

    // Create transporter object
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: user.email,
        pass: user.password, // App Password is recommended
      },
    });

    // Define mail options
    const mailOptions = {
      from: user.email,
      to: "phub2014686@student.ctu.edu.vn",
      subject: subject,
      html: htmlContent,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
