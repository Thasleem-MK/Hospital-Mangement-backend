import { Request, Response } from "express";
import nodemailer from "nodemailer";
import HttpError from "http-errors";

export const sendMail = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { from, to, subject, text } = req.body;

  // Configure transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "hostahealthcare@gmail.com",
      pass: "rtwtujyzvbzgasvp", // Be cautious storing credentials directly
    },
  });

  // Define mail options
  const mailOptions = {
    from: from,
    to: to,
    subject: subject,
    text: text,
  };

  // Send email and wait for the result
  const info = await transporter.sendMail(mailOptions);

  // Respond with a success message
  return res.status(200).json({
    message: "Email sent successfully!",
    info: info.response,
  });
};
