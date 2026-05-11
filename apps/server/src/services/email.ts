import { Resend } from 'resend'

// Lazy initialization - only create client when needed
let resend: Resend | null = null

const getResend = () => {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return null
    }
    resend = new Resend(apiKey)
  }
  return resend
}

const BRAND_COLOR = '#8b1d1d'
const BG_COLOR = '#fcf9f2'

export async function sendCapsuleEmail({
  to,
  recipientName,
  capsuleTitle,
  shareToken,
  deliveryDate
}: {
  to: string
  recipientName: string
  capsuleTitle: string
  shareToken: string
  deliveryDate?: Date | null
}) {
  const client = getResend()
  if (!client) {
    console.warn('RESEND_API_KEY not set, skipping email send')
    return { success: false, error: 'RESEND_API_KEY not configured' }
  }

  const unlockUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/unlock/${shareToken}`
  
  try {
    const { data, error } = await client.emails.send({
      from: 'Eternal Echoes <echoes@eternalechoes.app>',
      to: [to],
      subject: `✉️ You've received an Eternal Echo from ${recipientName}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>An Eternal Echo Awaits You</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
    
    body {
      margin: 0;
      padding: 0;
      font-family: 'Cormorant Garamond', Georgia, serif;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: ${BG_COLOR};
    }
    .header {
      background: linear-gradient(135deg, ${BRAND_COLOR}, #5c1212);
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      font-size: 28px;
      font-style: italic;
      margin: 0;
      font-weight: 400;
    }
    .content {
      padding: 40px 30px;
      text-align: center;
    }
    .wax-seal {
      width: 80px;
      height: 80px;
      background: linear-gradient(145deg, #dc2626, #991b1b);
      border-radius: 50%;
      margin: 0 auto 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
    }
    .wax-seal::after {
      content: "♥";
      color: white;
      font-size: 32px;
    }
    .title {
      font-size: 24px;
      color: #3f3f46;
      margin-bottom: 15px;
      font-style: italic;
    }
    .message {
      font-size: 16px;
      color: #71717a;
      line-height: 1.6;
      margin-bottom: 30px;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, ${BRAND_COLOR}, #5c1212);
      color: #ffffff;
      padding: 16px 40px;
      text-decoration: none;
      border-radius: 8px;
      font-size: 16px;
      letter-spacing: 1px;
      text-transform: uppercase;
      transition: all 0.3s ease;
    }
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(139, 29, 29, 0.3);
    }
    .footer {
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e4e4e7;
    }
    .footer p {
      font-size: 12px;
      color: #a1a1aa;
      margin: 0;
    }
    .divider {
      width: 60px;
      height: 1px;
      background: ${BRAND_COLOR};
      margin: 20px auto;
      opacity: 0.3;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Eternal Echoes</h1>
    </div>
    <div class="content">
      <div class="wax-seal"></div>
      <h2 class="title">${capsuleTitle}</h2>
      <p class="message">
        Someone has preserved a precious memory for you.<br>
        ${deliveryDate ? `It will be available on ${new Date(deliveryDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}.` : 'It is ready for you to open now.'}
      </p>
      <div class="divider"></div>
      <a href="${unlockUrl}" class="button">Open Your Echo</a>
      <p style="margin-top: 20px; font-size: 12px; color: #a1a1aa;">
        Or copy this link: ${unlockUrl}
      </p>
    </div>
    <div class="footer">
      <p>Preserved with care through Eternal Echoes</p>
      <p style="margin-top: 10px; font-size: 10px;">This link is unique to you. Please do not share it.</p>
    </div>
  </div>
</body>
</html>
      `
    })

    if (error) {
      console.error('Resend error:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (err) {
    console.error('Email send error:', err)
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
  }
}
