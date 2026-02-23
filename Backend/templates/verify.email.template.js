module.exports = function verifyEmailTemplate({ name, otp }) {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Verify Your Email</title>
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
                    Verify Your Email
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
                    Thank you for signing up! Use the OTP below to verify your email address.
                  </p>

                  <!-- OTP Box -->
                  <div
                    style="
                      background:#ecfdf5;
                      border:1px dashed #16a34a;
                      padding:16px;
                      text-align:center;
                      border-radius:6px;
                      margin:20px 0;
                    "
                  >
                    <p style="margin:0; font-size:12px; color:#065f46;">
                      Your Verification Code
                    </p>
                    <p style="
                      margin:8px 0 0;
                      font-size:24px;
                      font-weight:bold;
                      color:#16a34a;
                      letter-spacing:4px;
                    ">
                      G-${otp}
                    </p>
                  </div>

                  <p style="font-size:13px; color:#6b7280;">
                    This OTP will expire in <strong>10 minutes</strong>.
                    Please do not share this code with anyone.
                  </p>

                  <hr style="border:none; border-top:1px solid #e5e7eb; margin:24px 0;" />

                  <p style="font-size:12px; color:#9ca3af;">
                    If you did not create an account, you can safely ignore this email.
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
