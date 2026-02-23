module.exports = function resetPasswordEmailTemplate({ name, resetUrl }) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Reset Your Password</title>
    </head>

    <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:40px 10px;">
            
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:8px; overflow:hidden;">
              
              <!-- Header -->
              <tr>
                <td style="background:#16a34a; padding:20px; text-align:center;">
                  <h1 style="margin:0; color:#ffffff; font-size:22px;">
                    Reset Your Password
                  </h1>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:30px; color:#374151;">
                  <p style="font-size:14px; margin:0 0 12px;">
                    Hi <strong>${name}</strong>,
                  </p>

                  <p style="font-size:14px; line-height:1.6; margin:0 0 16px;">
                    We received a request to reset your password. Click the button below to continue.
                  </p>

                  <!-- Button -->
                  <table cellpadding="0" cellspacing="0" style="margin:20px 0;">
                    <tr>
                      <td align="center">
                        <a
                          href="${resetUrl}"
                          style="
                            display:inline-block;
                            padding:12px 24px;
                            background-color:#16a34a;
                            color:#ffffff;
                            text-decoration:none;
                            font-size:14px;
                            border-radius:6px;
                            font-weight:bold;
                          "
                        >
                          Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>

                  <p style="font-size:13px; color:#6b7280;">
                    This link will expire in <strong>10 minutes</strong>.
                    If you didn’t request this, you can ignore this email.
                  </p>

                  <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;" />

                  <p style="font-size:12px; color:#9ca3af;">
                    If the button doesn’t work, copy and paste this link:
                    <br />
                    <a href="${resetUrl}" style="color:#16a34a; word-break:break-all;">
                      ${resetUrl}
                    </a>
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f9fafb; padding:16px; text-align:center;">
                  <p style="margin:0; font-size:12px; color:#9ca3af;">
                    © ${new Date().getFullYear()} MentorMind Pvt. Ltd. All rights reserved
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};
