/**
 * DEA identity registration module for the EXISTING Discord OAuth Apps Script.
 * Integration pending: copy into the authenticated Apps Script project and call
 * deaRegisterIdentity_ only AFTER verifying Discord OAuth on the server.
 * Do not expose this function via an unauthenticated doPost.
 *
 * Script properties required: DEA_SHEET_ID, DEA_AVATAR_FOLDER_ID.
 */
function deaNormalizeSignature_(value) {
  const signature = String(value || '').trim().toUpperCase();
  if (!/^[A-Z0-9]{3}$/.test(signature)) throw new Error('La firma debe tener exactamente 3 letras mayúsculas o números.');
  return signature;
}
function deaIdentitySheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('DEA_SHEET_ID');
  if (!id) throw new Error('Falta DEA_SHEET_ID.');
  const ss = SpreadsheetApp.openById(id);
  let sheet = ss.getSheetByName('IDENTIDADES_DEA');
  if (!sheet) {
    sheet = ss.insertSheet('IDENTIDADES_DEA');
    sheet.appendRow(['discord_id','habbo_nick','firma','avatar_file_id','fecha_alta_utc','fecha_actualizacion_utc','estado']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}
function deaFindIdentity_(discordId) {
  if (!/^\d{15,22}$/.test(String(discordId || ''))) throw new Error('ID de Discord no verificado.');
  const rows = deaIdentitySheet_().getDataRange().getValues();
  const match = rows.slice(1).find(r => String(r[0]) === String(discordId));
  return match ? {habbo:match[1],signature:match[2],avatarFileId:match[3],status:match[6]} : null;
}
function deaCheckSignature_(signature) {
  const value = deaNormalizeSignature_(signature);
  const rows = deaIdentitySheet_().getDataRange().getValues();
  return !rows.slice(1).some(r => String(r[2]).trim().toUpperCase() === value);
}
/**
 * discordId MUST be obtained from the server-side OAuth session, never
 * trusted from an HTML form or query parameter.
 * avatarBase64: optional cropped JPEG/PNG/WebP base64, max 1 MB decoded.
 */
function deaRegisterIdentity_(discordId, habboNick, signature, avatarBase64, avatarMime) {
  if (!/^\d{15,22}$/.test(String(discordId || ''))) throw new Error('Discord no verificado.');
  const habbo = String(habboNick || '').trim();
  if (!/^[A-Za-z0-9._:-]{2,32}$/.test(habbo)) throw new Error('Nombre de Habbo no válido.');
  const sig = deaNormalizeSignature_(signature);
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = deaIdentitySheet_();
    const rows = sheet.getDataRange().getValues().slice(1);
    if (rows.some(r => String(r[0]) === String(discordId))) throw new Error('Esta cuenta de Discord ya tiene una identidad DEA.');
    if (rows.some(r => String(r[2]).trim().toUpperCase() === sig)) throw new Error('Esta firma ya está registrada.');
    let avatarFileId = '';
    if (avatarBase64) {
      const mime = String(avatarMime || '');
      if (!['image/jpeg','image/png','image/webp'].includes(mime)) throw new Error('Formato de imagen no permitido.');
      const bytes = Utilities.base64Decode(String(avatarBase64).replace(/^data:[^,]+,/, ''));
      if (bytes.length > 1048576) throw new Error('La imagen supera 1 MB.');
      const folderId = PropertiesService.getScriptProperties().getProperty('DEA_AVATAR_FOLDER_ID');
      if (!folderId) throw new Error('Falta configurar DEA_AVATAR_FOLDER_ID.');
      const file = DriveApp.getFolderById(folderId).createFile(Utilities.newBlob(bytes, mime, String(discordId) + '-avatar'));
      file.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
      avatarFileId = file.getId();
    }
    const now = new Date().toISOString();
    sheet.appendRow([String(discordId), habbo, sig, avatarFileId, now, now, 'PENDIENTE_VERIFICACION_HABBO']);
    SpreadsheetApp.flush();
    return {ok:true,habbo:habbo,signature:sig,status:'PENDIENTE_VERIFICACION_HABBO'};
  } finally { lock.releaseLock(); }
}

/**
 * Promotion is a privileged SERVER action, not a client-submitted role change.
 * verifiedActorId and authorizedScope MUST come from the trusted Discord OAuth
 * server session and server-side permission lookup, never from request JSON.
 * R7-R10 and Founder promotions require MASTER permission.
 */
function deaApprovePromotion_(verifiedActorId, authorizedScope, targetDiscordId, newRank, reason) {
  if (!/^\d{15,22}$/.test(String(verifiedActorId || '')) ||
      !/^\d{15,22}$/.test(String(targetDiscordId || ''))) throw new Error('Discord no verificado.');
  if (String(verifiedActorId) === String(targetDiscordId)) throw new Error('No puedes ascenderte a ti mismo.');
  if (!['MASTER','LOWER_RANK_APPROVER'].includes(authorizedScope)) throw new Error('Sin permiso para ascender.');
  const id = PropertiesService.getScriptProperties().getProperty('DEA_SHEET_ID');
  if (!id) throw new Error('Falta DEA_SHEET_ID.');
  const ss = SpreadsheetApp.openById(id);
  const ranks = ss.getSheetByName('RANGOS');
  const agents = ss.getSheetByName('AGENTES');
  if (!ranks || !agents) throw new Error('Faltan pestañas RANGOS o AGENTES.');
  const rankRows = ranks.getDataRange().getValues();
  const headers = rankRows.shift().map(String);
  const catCol = headers.indexOf('categoria'), rankCol = headers.indexOf('rango_interno');
  const rankNameCol = headers.indexOf('nombre_categoria');
  if (catCol < 0 || rankCol < 0 || rankNameCol < 0) throw new Error('Cabeceras de rangos no válidas.');
  const valid = rankRows.find(r => String(r[catCol]) + ':' + String(r[rankCol]) === String(newRank));
  if (!valid) throw new Error('El rango solicitado no existe en la jerarquía oficial.');
  const category = String(valid[catCol]);
  if (authorizedScope !== 'MASTER' && (/^R(?:[7-9]|10)$/.test(category) || /founder/i.test(String(valid[rankNameCol]))))
    throw new Error('Este rango requiere aprobación Master.');
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const values = agents.getDataRange().getValues();
    const cols = values[0].map(String);
    const discordCol = cols.indexOf('discord_id'), rankField = cols.indexOf('rango'), catField = cols.indexOf('categoria');
    const ascField = cols.indexOf('ultimo_ascenso_utc'), nextField = cols.indexOf('siguiente_rango');
    if ([discordCol,rankField,catField,ascField,nextField].some(i => i < 0)) throw new Error('Cabeceras AGENTES incompletas.');
    const rowIndex = values.findIndex((r,i) => i > 0 && String(r[discordCol]) === String(targetDiscordId));
    if (rowIndex < 0) throw new Error('El agente no tiene ficha aprobada.');
    const row = values[rowIndex], previous = String(row[catField]) + ':' + String(row[rankField]);
    const oldIndex = rankRows.findIndex(r => String(r[catCol])+':'+String(r[rankCol]) === previous);
    const newIndex = rankRows.indexOf(valid);
    if (oldIndex < 0 || newIndex !== oldIndex + 1) throw new Error('Solo se permite el siguiente rango oficial.');
    const now = new Date().toISOString();
    const log = ss.getSheetByName('AUDITORIA');
    if (!log) throw new Error('Falta AUDITORIA; no se puede ascender sin trazabilidad.');
    const next = rankRows[newIndex + 1];
    const nextValue = next ? String(next[catCol])+':'+String(next[rankCol]) : '';
    log.appendRow([now,'ASCENSO',String(targetDiscordId),previous,String(newRank),String(verifiedActorId),String(reason||'')]);
    agents.getRange(rowIndex+1,catField+1).setValue(category);
    agents.getRange(rowIndex+1,rankField+1).setValue(valid[rankCol]);
    agents.getRange(rowIndex+1,ascField+1).setValue(now);
    agents.getRange(rowIndex+1,nextField+1).setValue(nextValue);
    SpreadsheetApp.flush();
    return {ok:true,previous:previous,current:String(newRank),next:nextValue};
  } finally {lock.releaseLock();}
}
