// Transactional emails via Resend (https://resend.com).
// Set RESEND_API_KEY and EMAIL_FROM in your environment to enable.
// Falls back to console.log when not configured (dev / CI).

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(payload: EmailPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'noreply@immersive-marketplace.com';

  if (!apiKey) {
    console.log(`[EMAIL] To: ${payload.to} | Subject: ${payload.subject}`);
    return;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: payload.to, subject: payload.subject, html: payload.html }),
  });

  if (!res.ok) {
    console.error(`[EMAIL] Send failed: ${await res.text()}`);
  }
}

export function sendOrderConfirmation(params: {
  to: string;
  name: string;
  orderNumber: string;
  total: number;
  items: { title: string; quantity: number; price: number }[];
}) {
  const rows = params.items
    .map(
      (i) =>
        `<tr><td style="padding:6px 0">${i.quantity}× ${i.title}</td>` +
        `<td style="text-align:right;padding:6px 0">${(i.price * i.quantity).toLocaleString('fr-FR')} FCFA</td></tr>`
    )
    .join('');

  return sendEmail({
    to: params.to,
    subject: `Confirmation de commande #${params.orderNumber}`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111">
      <h2 style="margin-bottom:8px">Merci pour votre commande, ${params.name} !</h2>
      <p>Votre commande <strong>#${params.orderNumber}</strong> a bien été reçue et est en cours de traitement.</p>
      <table style="width:100%;border-collapse:collapse;margin:24px 0;font-size:14px">
        ${rows}
        <tr style="border-top:2px solid #eee;font-weight:bold">
          <td style="padding-top:12px">Total</td>
          <td style="text-align:right;padding-top:12px">${params.total.toLocaleString('fr-FR')} FCFA</td>
        </tr>
      </table>
      <p>Nous vous contacterons dès que votre commande sera expédiée.</p>
      <p style="color:#888;font-size:12px;margin-top:32px">Immersive Marketplace • N'Djaména, Tchad</p>
    </div>`,
  });
}

export function sendShippingNotification(params: {
  to: string;
  name: string;
  orderNumber: string;
  trackingNumber?: string;
}) {
  return sendEmail({
    to: params.to,
    subject: `Votre commande #${params.orderNumber} est en chemin !`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111">
      <h2>Bonne nouvelle, ${params.name} !</h2>
      <p>Votre commande <strong>#${params.orderNumber}</strong> a été expédiée.</p>
      ${params.trackingNumber ? `<p>Numéro de suivi : <strong>${params.trackingNumber}</strong></p>` : ''}
      <p>Vous recevrez votre colis dans les prochains jours ouvrés.</p>
      <p style="color:#888;font-size:12px;margin-top:32px">Immersive Marketplace • N'Djaména, Tchad</p>
    </div>`,
  });
}

export function sendOrderCancellation(params: {
  to: string;
  name: string;
  orderNumber: string;
}) {
  return sendEmail({
    to: params.to,
    subject: `Commande #${params.orderNumber} annulée`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111">
      <h2>Commande annulée</h2>
      <p>Bonjour ${params.name},</p>
      <p>Votre commande <strong>#${params.orderNumber}</strong> a été annulée.</p>
      <p>Si vous avez payé par carte bancaire, le remboursement sera effectué sous 5 à 10 jours ouvrés sur votre compte.</p>
      <p style="color:#888;font-size:12px;margin-top:32px">Immersive Marketplace • N'Djaména, Tchad</p>
    </div>`,
  });
}
