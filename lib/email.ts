import nodemailer from "nodemailer";

// Test account for development
const createTestAccount = async () => {
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

// For production, use actual SMTP settings But this feature is not implemented
const createProductionTransport = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string
) => {
  const transporter =
    process.env.NODE_ENV === "production"
      ? createProductionTransport()
      : await createTestAccount();

  const info = await transporter.sendMail({
    from: '"Invoice Reminder" <noreply@example.com>',
    to,
    subject,
    text,
    html,
  });

  console.log("Message sent: %s", info.messageId);

  if (process.env.NODE_ENV !== "production") {
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }

  return info;
};
