const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_USER_PASS,
    }
});

module.exports.sendRegisterAdminMail = async (first_name, last_name, to, pass) => {
    const websiteURL = "https://rajdeep-codefolio.vercel.app";
    const societyName = "Astvinayak Bungalows";

    const mailOptions = {
        from: `"${societyName} Management" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: `Admin Credentials - ${societyName} Portal`,
        text: `Welcome to ${societyName}! Your admin account has been created. Website: ${websiteURL}, Email: ${to}, Password: ${pass}. Please login and change your password immediately.`,
        html: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
            body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f8f6f0; }

            @media screen and (max-width: 600px) {
                .container-table { width: 100% !important; padding-left: 12px !important; padding-right: 12px !important; }
                .content-cell { padding: 24px 16px !important; }
                .mobile-btn { width: 100% !important; text-align: center !important; }
                .credentials-label { width: 100% !important; display: block !important; padding-bottom: 2px !important; }
                .credentials-value { width: 100% !important; display: block !important; padding-bottom: 8px !important; }
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f8f6f0; font-family: 'Segoe UI', Arial, sans-serif; color: #4a3e3d;">
        <!-- Background Wrapper -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8f6f0; table-layout: fixed;">
            <tr>
                <td align="center" style="padding: 30px 10px;">
                    
                    <!-- Main Card Container -->
                    <table border="0" cellpadding="0" cellspacing="0" width="580" class="container-table" style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e0d6cc; max-width: 580px; width: 100%; overflow: hidden;">
                        
                        <!-- Header -->
                        <tr>
                            <td align="center" style="background-color: #8c6d58; padding: 30px 20px;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">
                                    ${societyName}
                                </h1>
                                <p style="color: #f3efe9; margin: 6px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px;">
                                    Society Management Portal
                                </p>
                            </td>
                        </tr>

                        <!-- Body Content -->
                        <tr>
                            <td class="content-cell" style="padding: 32px 28px; background-color: #ffffff;">
                                <p style="font-size: 16px; margin: 0 0 12px 0; color: #4a3e3d; font-weight: 600;">Namaste,</p>
                                <p style="font-size: 14px; color: #5a4d4b; line-height: 1.6; margin: 0 0 24px 0;">
                                    You have been registered as an <strong>Administrator</strong> for <strong>${societyName}</strong>. You now have full access to manage society operations, members, and records.
                                </p>

                                <!-- Credentials Box -->
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #faf8f5; border: 1px solid #e0d6cc; border-radius: 8px; margin-bottom: 24px;">
                                    <tr>
                                        <td style="padding: 18px;">
                                            <div style="font-size: 11px; font-weight: 700; color: #8c6d58; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                                                Account Credentials
                                            </div>
                                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px;">
                                                <tr>
                                                    <td class="credentials-label" style="padding: 5px 0; color: #7a6e6b; width: 120px;">Portal URL:</td>
                                                    <td class="credentials-value" style="padding: 5px 0;">
                                                        <a href="${websiteURL}" style="color: #8c6d58; font-weight: 600; text-decoration: none;">${websiteURL}</a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="credentials-label" style="padding: 5px 0; color: #7a6e6b;">Admin Name:</td>
                                                    <td class="credentials-value" style="padding: 5px 0; color: #4a3e3d; font-weight: 600;">${first_name} ${last_name}</td>
                                                </tr>
                                                <tr>
                                                    <td class="credentials-label" style="padding: 5px 0; color: #7a6e6b;">Temp Password:</td>
                                                    <td class="credentials-value" style="padding: 5px 0;">
                                                        <code style="font-family: 'Courier New', Courier, monospace; background-color: #eee9e0; color: #4a3e3d; padding: 3px 8px; border-radius: 4px; font-weight: 700; font-size: 14px;">${pass}</code>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <!-- CTA Button -->
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td align="center" style="padding: 8px 0 24px 0;">
                                            <table border="0" cellpadding="0" cellspacing="0" class="mobile-btn">
                                                <tr>
                                                    <td align="center" style="border-radius: 6px; background-color: #8c6d58;">
                                                        <a href="${websiteURL}" target="_blank" style="font-size: 14px; color: #ffffff; text-decoration: none; border-radius: 6px; padding: 12px 28px; border: 1px solid #8c6d58; display: inline-block; font-weight: 600;">
                                                            Access Admin Dashboard
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Warning Box -->
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fdf7f4; border-left: 4px solid #b85d43; border-radius: 0 4px 4px 0;">
                                    <tr>
                                        <td style="padding: 12px 14px;">
                                            <p style="margin: 0; font-size: 12px; color: #8a3a25; line-height: 1.5;">
                                                <strong>Action Required:</strong> Log in using this temporary password and update it immediately from your profile settings for security compliance.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td align="center" style="background-color: #f8f6f0; padding: 20px 24px; border-top: 1px solid #e0d6cc; font-size: 12px; color: #7a6e6b;">
                                <p style="margin: 0;">This is an automated system mail for <strong>${societyName}</strong>.</p>
                                <p style="margin: 4px 0 0 0;">Please do not reply directly to this email.</p>
                            </td>
                        </tr>

                    </table>

                </td>
            </tr>
        </table>
    </body>
    </html>
    `
    };

    return await transporter.sendMail(mailOptions);
};

module.exports.forgotPasswordAdminMail = async (OTP, to) => {
    
    const mailOptions = {
        from: '"Astvinayak Bungalows" <rajdeepex5270@gmail.com>',
        to: to,
        subject: 'Password Reset Verification Code - Astvinayak Bungalows',
        text: `Your password reset OTP is: ${OTP}. This code will expire in 10 minutes.`,
        html: `
    <!DOCTYPE html>
    <html> 
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset OTP</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #FAFAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FAFAFC; padding: 40px 10px;">
            <tr>
                <td align="center">
                    
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border: 1px solid #EFE8E1; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(44, 34, 30, 0.03);">
                        
                        <tr>
                            <td style="background-color: #F7F3E9; padding: 28px 32px; border-bottom: 1px solid #EFE8E1; text-align: left;">
                                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td>
                                            <span style="font-size: 18px; font-weight: 700; color: #2C221E; letter-spacing: -0.2px; display: block;">
                                                Astvinayak Bungalows
                                            </span>
                                            <span style="font-size: 11px; font-weight: 600; color: #8C6D53; text-transform: uppercase; letter-spacing: 1px; display: block; margin-top: 2px;">
                                                Resident Portal Security
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 36px 32px; text-align: left;">
                                <h1 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #2C221E; line-height: 1.3;">
                                    Password Reset Request
                                </h1>
                                <p style="margin: 0 0 24px 0; font-size: 14px; color: #6E5A4D; line-height: 1.6;">
                                    We received a request to reset your account password for the resident portal. Use the verification code below to complete your request:
                                </p>

                                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                                    <tr>
                                        <td align="center" style="background-color: #FAF8F5; border: 1px border-#EFE8E1; border: 1.5px dashed #D8C8BA; border-radius: 12px; padding: 20px 10px;">
                                            <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 800; color: #2C221E; letter-spacing: 8px; display: block;">
                                                ${OTP}
                                            </span>
                                            <span style="font-size: 11px; font-weight: 600; color: #8C6D53; uppercase; letter-spacing: 0.5px; display: block; margin-top: 6px;">
                                                Valid for 10 minutes
                                            </span>
                                        </td>
                                    </tr>
                                </table>

                                <p style="margin: 0 0 8px 0; font-size: 13px; color: #8C7A6B; line-height: 1.5;">
                                    If you did not request a password reset, please ignore this email or contact your society admin if you have concerns.
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td style="background-color: #FAFAFC; padding: 20px 32px; border-top: 1px solid #EFE8E1; text-align: center;">
                                <p style="margin: 0; font-size: 11px; color: #A8927F; line-height: 1.4;">
                                    This is an automated message from Astvinayak Bungalows Resident Portal.<br>
                                    Deladva Gam, Surat, Gujarat - 394210
                                </p>
                            </td>
                        </tr>

                    </table>
                    
                </td>
            </tr>
        </table>
    </body>
    </html>
    `
    };

    return await transporter.sendMail(mailOptions);
}