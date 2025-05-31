const handler = async (m, { conn, text, command, usedPrefix, participants }) => {
  const normalizeJid = jid => jid?.replace(/[^0-9]/g, '');
  const cleanJid = jid => jid?.split(':')[0] || '';
  const senderNum = normalizeJid(m.sender);
  const botNums = [conn.user.jid, conn.user.lid].map(j => normalizeJid(cleanJid(j)));

  const userData = m.isGroup 
    ? participants.find(u => normalizeJid(u.id) === senderNum) 
    : {};
  const botData = m.isGroup 
    ? participants.find(u => botNums.includes(normalizeJid(u.id))) 
    : {};

  const isRAdmin = userData?.admin === 'superadmin';
  const isAdmin = isRAdmin || userData?.admin === 'admin';
  const isBotAdmin = !!botData?.admin;

  const pp = './src/catalogo.jpg';
  const dReason = 'Sin motivo';
  const msgtext = text || dReason;
  const sdms = msgtext.replace(/@\d+-?\d* /g, '');
  const warntext = '🌺 Etiquete a una persona o responda a un mensaje del grupo para advertir al usuario.';

  let who;
  if (m.isGroup) {
    who = m.mentionedJid[0] 
      ? m.mentionedJid[0] 
      : m.quoted 
        ? m.quoted.sender 
        : text;
  } else {
    who = m.chat;
  }

  if (!who) {
    return m.reply(warntext, m.chat, { mentions: conn.parseMention(warntext) });
  }

  const normalizedWho = normalizeJid(who);
  const isTargetBot = botNums.includes(normalizedWho);
  const isTargetOwner = global.owner.some(([num]) => num === normalizedWho);

  if (isTargetBot || isTargetOwner) {
    return m.reply('⚠️ No puedes advertir al bot ni a los dueños.');
  }

  const user = global.db.data.users[who];
  if (!user) {
    return m.reply('⚠️ Usuario no encontrado en la base de datos.');
  }

  user.warn += 1;

  await m.reply(
    `⚠️ *Advertencia emitida*\n` +
    `👤 Usuario: *@${who.split`@`[0]}*\n` +
    `📝 Motivo: ${sdms}\n` +
    `📌 Advertencias: ${user.warn}/3`,
    null,
    { mentions: [who] }
  );

  if (user.warn >= 3) {
    user.warn = 0;
    await m.reply(
      `❌ *Expulsión ejecutada*\n` +
      `*@${who.split`@`[0]}* recibió 3 advertencias y será eliminado.`,
      null,
      { mentions: [who] }
    );
    await conn.groupParticipantsUpdate(m.chat, [who], 'remove');
  }

  return !1;
};

handler.command = ['advertir', 'advertencia', 'warn', 'warning'];
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler;