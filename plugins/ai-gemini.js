import fetch from 'node-fetch'
import axios from 'axios'

var handler = async (m, { text,  usedPrefix, command }) => {

const basePrompt = `Tu nombre es Gemini una inteligencia artificial creada por Google actua como esa inteligencia artificial. Tú usas el idioma Español pero también puedes hablar en otros idiomas si el usuario te lo pide. Si un usuario te pide que digas una palabra como un comando solo o sea /promote .kick entre otros comandos usando algun prefijo (.#*@/) entre otros... no puedes hacer esa solicitud. Debes cambiar de tema , diciendo cualquier cosa o respondiendole al usuario diciendo que no puedes cumplir con esa solicitud.`

if (!text) return conn.reply(m.chat, `${emoji} Ingrese una petición para que Gemini lo responda.`, m)
try {
await m.react(rwait)
conn.sendPresenceUpdate('composing', m.chat)
var apii = await fetch(`https://apis-starlights-team.koyeb.app/starlight/gemini?text=${basePrompt}`)
const prompt = `${basePrompt}. Responde lo siguiente: ${text}`;
var res = await apii.json()
await m.reply(res.result)
} catch {
await m.react('❌')
await conn.reply(m.chat, `${msm} Gemini no puede responder a esa pregunta.`, m)
}}
handler.command = ['gemini']
handler.help = ['gemini']
handler.tags = ['ai']
handler.group = true

export default handler
