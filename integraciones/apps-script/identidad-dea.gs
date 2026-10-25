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
  if (!/^\\d{15,22}$/.test(String(discordId || ''))) throw new Error('ID de Discord no verificado.');
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
  if (!/^\\d{15,22}$/.test(String(discordId || ''))) throw new Error('Discord no verificado.');
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
