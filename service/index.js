import { handleOptSender } from "./auth";

export function extractHours(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return 0;

  timeStr = timeStr.trim().toLowerCase();

  if (timeStr.endsWith("h")) {
    const hours = parseFloat(timeStr.replace("h", ""));
    return isNaN(hours) ? 0 : hours;
  }
  if (timeStr.endsWith("w")) {
    const week = parseFloat(timeStr.replace("w", ""));
    return isNaN(hours) ? 0 : week * 7;
  }

  if (timeStr.endsWith("m")) {
    const minutes = parseFloat(timeStr.replace("m", ""));
    return isNaN(minutes) ? 0 : minutes / 60;
  }

  // If no unit provided, assume hours
  const fallback = parseFloat(timeStr);
  return isNaN(fallback) ? 0 : fallback;
}


export const sendMailNotificationtoMembers = async (project_name, members) => {
  await handleOptSender.sendMail({
    from: process.env.NODE_EMAIL_ADDRESS,
    to: members.map((mem) => mem.label), // flat array of email strings
    subject: `You’ve been added to project: ${project_name}`,
    html: `<html>
    <head>
      <meta charset="UTF-8" />
      <title>Project Assignment</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          padding: 20px;
        }
        .email-container {
          max-width: 600px;
          margin: auto;
          background-color: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.05);
        }
        h2 {
          color: #333333;
        }
        p {
          color: #555555;
          line-height: 1.6;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #999999;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <h2>You've been added to a new project!</h2>
        <p>Hello,</p>
        <p>You have been added as a <strong>member</strong> of the project <strong>"${project_name}"</strong></p>
        <p>You can now collaborate with your team, manage tasks, and track progress.</p>
        <p>If you have any questions, please contact your project admin.</p>
        <div class="footer">
          &copy; 2025 Project Management System. All rights reserved.
        </div>
      </div>
    </body>
  </html>`
  });

}



// module.exports = { sendMailNotificationtoMembers, extractHours }