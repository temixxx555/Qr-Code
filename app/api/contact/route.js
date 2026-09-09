import nodemailer from "nodemailer";

const SUBJECTS = {
  general: "General question",
  technical: "Technical issue",
  billing: "Billing & subscription",
  "qr-code": "QR code issue",
  analytics: "Analytics",
  feature: "Feature request",
  feedback: "Feedback",
  other: "Other",
};

export async function POST(request) {
  try {
    const body = await request.json();

    const name =
      String(body.name || "").trim();

    const email =
      String(body.email || "")
        .trim()
        .toLowerCase();

    const subject =
      String(body.subject || "");

    const message =
      String(body.message || "").trim();

    if (
      !name ||
      !email ||
      !subject ||
      !message
    ) {
      return Response.json(
        {
          message:
            "Please complete all required fields.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email,
      )
    ) {
      return Response.json(
        {
          message:
            "Please enter a valid email address.",
        },
        {
          status: 400,
        },
      );
    }

    if (message.length > 2000) {
      return Response.json(
        {
          message:
            "Your message is too long.",
        },
        {
          status: 400,
        },
      );
    }

    const subjectLabel =
      SUBJECTS[subject] || "Contact request";

  const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),

  secure: false,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

    await transporter.sendMail({
      from: `"Smart QR" <${process.env.SMTP_FROM}>`,

      to: process.env.CONTACT_EMAIL,

      replyTo: email,

      subject:
        `[Smart QR] ${subjectLabel}`,

      text: `
New contact request

Name: ${name}
Email: ${email}
Subject: ${subjectLabel}

Message:
${message}
      `.trim(),

      html: `
        <div
          style="
            font-family:Arial,sans-serif;
            max-width:600px;
            margin:auto;
            color:#0f172a;
          "
        >
          <div
            style="
              padding:24px;
              border:1px solid #e2e8f0;
              border-radius:16px;
            "
          >
            <p
              style="
                color:#10b981;
                font-size:12px;
                font-weight:700;
                text-transform:uppercase;
              "
            >
              Smart QR
            </p>

            <h2>
              New contact message
            </h2>

            <div
              style="
                background:#f8fafc;
                padding:16px;
                border-radius:12px;
                margin:20px 0;
              "
            >
              <p>
                <strong>Name:</strong>
                ${escapeHtml(name)}
              </p>

              <p>
                <strong>Email:</strong>
                ${escapeHtml(email)}
              </p>

              <p>
                <strong>Subject:</strong>
                ${escapeHtml(subjectLabel)}
              </p>
            </div>

            <p
              style="
                white-space:pre-wrap;
                line-height:1.7;
              "
            >${escapeHtml(message)}</p>
          </div>
        </div>
      `,
    });

    return Response.json({
      success: true,
      message:
        "Thanks! Your message has been sent.",
    });
  } catch (error) {
    console.error(
      "Contact form error:",
      error,
    );

    return Response.json(
      {
        message:
          "We couldn't send your message right now.",
      },
      {
        status: 500,
      },
    );
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}