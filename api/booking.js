// Vercel Serverless Function: nhan yeu cau dat phong tu website,
// day tuc thi qua Telegram cho chu khach san. Khong luu tru gi ca.
module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { name, phone, rooms, note } = req.body || {};

  if (!name || !phone || !rooms) {
    return res.status(400).json({ ok: false, error: 'Thiếu thông tin bắt buộc' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error('Thieu TELEGRAM_BOT_TOKEN hoac TELEGRAM_CHAT_ID trong bien moi truong Vercel');
    return res.status(500).json({ ok: false, error: 'Server chưa cấu hình xong' });
  }

  const safe = (s) => String(s).slice(0, 500);
  const text =
    `📋 YÊU CẦU ĐẶT PHÒNG MỚI - Khách Sạn Hoa Đô\n\n` +
    `👤 Họ tên: ${safe(name)}\n` +
    `📞 SĐT: ${safe(phone)}\n` +
    `🛏️ Số phòng cần đặt: ${safe(rooms)}` +
    (note ? `\n📝 Ghi chú: ${safe(note)}` : '') +
    `\n\n🕒 ${new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}`;

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    const tgData = await tgRes.json();
    if (!tgData.ok) {
      console.error('Telegram API loi:', tgData);
      return res.status(502).json({ ok: false, error: 'Không gửi được thông báo' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Loi khi goi Telegram API:', err);
    return res.status(500).json({ ok: false, error: 'Lỗi máy chủ' });
  }
};
