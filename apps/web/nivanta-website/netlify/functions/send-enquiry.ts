import { Resend } from "resend";
import type { Handler } from "@netlify/functions";

const resend = new Resend(process.env["RESEND_API_KEY"]);
const TO   = process.env["ENQUIRY_TO_EMAIL"]   ?? "sales@nivantahospitality.com";
const FROM = process.env["ENQUIRY_FROM_EMAIL"]  ?? "enquiries@nivantahospitality.com";

function notificationHtml(d: Record<string, string>): string {
  return `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1a1a1a">
      <div style="background:#032105;padding:24px 32px">
        <h1 style="color:#D4B870;font-size:22px;margin:0;letter-spacing:2px">NEW ENQUIRY</h1>
        <p style="color:#ffffff80;font-size:12px;margin:4px 0 0">Silvanza Resort by Nivanta</p>
      </div>
      <div style="padding:32px;background:#FAF7F0;border:1px solid #D4B87033">
        <table style="width:100%;border-collapse:collapse">
          ${[
            ["Name",         d.name],
            ["Email",        d.email],
            ["Phone",        d.phone || "—"],
            ["Enquiry Type", d.enquiryType],
            ["Check-in",     d.checkin  || "—"],
            ["Check-out",    d.checkout || "—"],
          ].map(([label, val]) => `
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #D4B87022;color:#666;font-size:12px;letter-spacing:1px;text-transform:uppercase;width:120px">${label}</td>
              <td style="padding:8px 0;border-bottom:1px solid #D4B87022;font-size:14px;color:#032105">${val}</td>
            </tr>`).join("")}
        </table>
        ${d.message ? `
          <div style="margin-top:24px;padding:20px;background:#fff;border-left:3px solid #D4B870">
            <p style="margin:0 0 8px;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#666">Message</p>
            <p style="margin:0;font-size:14px;line-height:1.7;color:#1a1a1a">${d.message}</p>
          </div>` : ""}
      </div>
      <div style="padding:16px 32px;background:#032105;text-align:center">
        <p style="color:#ffffff40;font-size:11px;margin:0">Silvanza Resort — Dhikuli, Ramnagar, Uttarakhand</p>
      </div>
    </div>`;
}

function confirmationHtml(name: string): string {
  return `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;color:#1a1a1a">
      <div style="background:#032105;padding:24px 32px">
        <h1 style="color:#D4B870;font-size:22px;margin:0;letter-spacing:2px">SILVANZA RESORT</h1>
        <p style="color:#ffffff80;font-size:12px;margin:4px 0 0">by Nivanta</p>
      </div>
      <div style="padding:40px 32px;background:#FAF7F0">
        <p style="font-size:18px;color:#032105;margin:0 0 16px">Dear ${name},</p>
        <p style="font-size:14px;line-height:1.8;color:#444;margin:0 0 16px">
          Thank you for reaching out to Silvanza Resort. We have received your enquiry and our reservations team will be in touch within <strong>2 hours</strong>.
        </p>
        <p style="font-size:14px;line-height:1.8;color:#444;margin:0 0 32px">
          In the meantime, if you have any urgent requirements, please call us directly at <a href="tel:+919792106111" style="color:#B98F39">+91 979 210 6111</a>.
        </p>
        <div style="border-top:1px solid #D4B87033;padding-top:24px">
          <p style="font-size:12px;color:#888;margin:0;font-style:italic">
            Where the Forest Meets Finesse — Dhikuli, Ramnagar, Uttarakhand
          </p>
        </div>
      </div>
      <div style="padding:16px 32px;background:#032105;text-align:center">
        <p style="color:#ffffff40;font-size:11px;margin:0">© 2026 Silvanza Resort by Nivanta. All rights reserved.</p>
      </div>
    </div>`;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  let data: Record<string, string>;
  try {
    data = JSON.parse(event.body ?? "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
  }

  if (!data.name || !data.email || !data.message) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
  }

  try {
    await Promise.all([
      resend.emails.send({
        from: FROM,
        to:   TO,
        subject: `[Enquiry] ${data.name} — ${data.enquiryType ?? "General"}`,
        html: notificationHtml(data),
      }),
      resend.emails.send({
        from: FROM,
        to:   data.email,
        subject: "Your enquiry at Silvanza Resort — we'll be in touch shortly",
        html: confirmationHtml(data.name),
      }),
    ]);

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error("Resend error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to send email" }) };
  }
};
