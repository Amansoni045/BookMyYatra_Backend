const nodemailer = require("nodemailer");

const sendBookingNotification = async (req, res) => {
    try {
        const { email, phone, bookingId, hotel, amount } = req.body;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"BookMyYatra.support" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Your booking is confirmed • ${hotel}`,
            html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
          <p>Hi,</p>

          <p>Your booking has been successfully confirmed. Below are the details for your stay:</p>

          <div style="background:#f7f7f7; padding:16px; border-radius:8px;">
            <p><strong>Hotel:</strong> ${hotel}</p>
            <p><strong>Booking ID:</strong> ${bookingId}</p>
            <p><strong>Amount Paid:</strong> ₹${amount}</p>
          </div>

          <p style="margin-top:16px;">
            You don’t need to take any further action. Just carry this booking ID while checking in.
          </p>

          <p>
            If you have any questions or need help, feel free to reply to this email.
          </p>

          <p style="margin-top:24px;">
            Wishing you a comfortable stay,<br />
            <strong>Team BookMyYatra</strong>
          </p>
        </div>
      `,
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Notification Error:", error);
        return res.status(500).json({ success: false });
    }
};

module.exports = { sendBookingNotification };
