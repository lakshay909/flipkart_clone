const nodemailer = require('nodemailer');

// ─── NODEMAILER TRANSPORTER ───────────────────────────────────────────────────
// Uses Gmail with an App Password (NOT your regular Gmail password).
// To generate an App Password:
// 1. Go to your Google Account → Security → 2-Step Verification → App Passwords
// 2. Choose app: Mail, device: Other, name it "Flipkart Clone"
// 3. Copy the 16-character password and put it in EMAIL_PASS env variable

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,  // Your Gmail address
    pass: process.env.EMAIL_PASS,  // Your 16-char App Password (NOT your Gmail password)
  },
});

// ─── HTML EMAIL TEMPLATE ──────────────────────────────────────────────────────
const buildOrderEmailHtml = (orderDetails) => {
  const { orderId, totalAmount, shippingAddress, items = [] } = orderDetails;

  const formattedTotal = Number(totalAmount).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  });

  const itemsHtml = items.length > 0
    ? items.map(item => `
        <tr>
          <td style="padding: 10px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #212121;">
            ${item.title || 'Product'}
          </td>
          <td style="padding: 10px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #212121; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 10px 16px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #212121; text-align: right;">
            ₹${Number(item.price_at_purchase).toLocaleString('en-IN')}
          </td>
        </tr>`).join('')
    : `<tr><td colspan="3" style="padding: 16px; color: #878787; text-align: center; font-size: 14px;">Order items will be delivered as confirmed.</td></tr>`;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const deliveryStr = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmed - Flipkart Clone</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f1f3f6; font-family: 'Roboto', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f3f6; padding: 24px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

            <!-- ── HEADER ── -->
            <tr>
              <td style="background-color: #2874f0; padding: 20px 32px; border-radius: 4px 4px 0 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <span style="font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">
                        Flipkart
                      </span>
                      <span style="font-size: 11px; font-style: italic; color: #d0e8ff; margin-left: 4px;">
                        Clone
                      </span>
                    </td>
                    <td align="right">
                      <span style="background: #ffffff; color: #2874f0; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 3px; text-transform: uppercase; letter-spacing: 0.5px;">
                        Order Confirmed
                      </span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- ── SUCCESS BANNER ── -->
            <tr>
              <td style="background-color: #26a541; padding: 20px 32px; text-align: center;">
                <p style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff;">
                  ✅ Your order is confirmed!
                </p>
                <p style="margin: 8px 0 0; font-size: 14px; color: #d4f5dc;">
                  Your package is on its way. Sit back and relax!
                </p>
              </td>
            </tr>

            <!-- ── ORDER DETAILS ── -->
            <tr>
              <td style="background-color: #ffffff; padding: 28px 32px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding-bottom: 20px;">
                      <p style="margin: 0 0 4px; font-size: 12px; color: #878787; text-transform: uppercase; letter-spacing: 0.5px;">Order ID</p>
                      <p style="margin: 0; font-size: 18px; font-weight: 700; color: #2874f0;">#${orderId}</p>
                    </td>
                    <td align="right" style="padding-bottom: 20px;">
                      <p style="margin: 0 0 4px; font-size: 12px; color: #878787; text-transform: uppercase; letter-spacing: 0.5px; text-align: right;">Expected Delivery</p>
                      <p style="margin: 0; font-size: 14px; font-weight: 600; color: #212121; text-align: right;">${deliveryStr}</p>
                    </td>
                  </tr>
                </table>

                <!-- Items Table -->
                <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #f0f0f0; border-radius: 4px;">
                  <thead>
                    <tr style="background-color: #f7f7f7;">
                      <th style="padding: 10px 16px; font-size: 12px; color: #878787; font-weight: 600; text-align: left; text-transform: uppercase;">Item</th>
                      <th style="padding: 10px 16px; font-size: 12px; color: #878787; font-weight: 600; text-align: center; text-transform: uppercase;">Qty</th>
                      <th style="padding: 10px 16px; font-size: 12px; color: #878787; font-weight: 600; text-align: right; text-transform: uppercase;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>

                <!-- Total Row -->
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px; border-top: 2px solid #f0f0f0; padding-top: 16px;">
                  <tr>
                    <td style="font-size: 16px; font-weight: 700; color: #212121; padding-top: 16px;">Total Amount</td>
                    <td style="font-size: 18px; font-weight: 700; color: #2874f0; text-align: right; padding-top: 16px;">${formattedTotal}</td>
                  </tr>
                </table>

                <!-- Shipping Address -->
                <div style="margin-top: 24px; padding: 16px; background: #f7f9ff; border-left: 4px solid #2874f0; border-radius: 0 4px 4px 0;">
                  <p style="margin: 0 0 6px; font-size: 12px; color: #878787; text-transform: uppercase; letter-spacing: 0.5px;">📍 Delivering to</p>
                  <p style="margin: 0; font-size: 14px; font-weight: 500; color: #212121; line-height: 1.6;">${shippingAddress || 'Address on file'}</p>
                </div>
              </td>
            </tr>

            <!-- ── FOOTER ── -->
            <tr>
              <td style="background-color: #f7f7f7; padding: 20px 32px; text-align: center; border-radius: 0 0 4px 4px; border-top: 1px solid #e8e8e8;">
                <p style="margin: 0 0 8px; font-size: 13px; color: #878787;">
                  Questions about your order? Contact us at
                  <a href="mailto:${process.env.EMAIL_USER}" style="color: #2874f0; text-decoration: none;">${process.env.EMAIL_USER}</a>
                </p>
                <p style="margin: 0; font-size: 12px; color: #bbb;">
                  This is a demo project. Not affiliated with Flipkart India Pvt. Ltd.
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

// ─── SEND ORDER CONFIRMATION EMAIL ────────────────────────────────────────────
/**
 * Sends a professional order confirmation email.
 * @param {string} userEmail - Recipient email address
 * @param {Object} orderDetails - { orderId, totalAmount, shippingAddress, items }
 */
const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
  const mailOptions = {
    from: `"Flipkart Clone" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: `✅ Order Confirmed! #${orderDetails.orderId} - Your package is on its way`,
    html: buildOrderEmailHtml(orderDetails),
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 Order confirmation email sent to ${userEmail} [MessageId: ${info.messageId}]`);
  return info;
};

module.exports = { sendOrderConfirmationEmail };
