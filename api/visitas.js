import {get, list, put} from '@vercel/blob';
import {createHash} from 'node:crypto';

const PATH = 'dea-visitas/v3/contador.json';
const DAY = 24 * 60 * 60 * 1000;
const dayOf = now => new Intl.DateTimeFormat('en-CA', {timeZone:'Europe/Madrid', year:'numeric', month:'2-digit', day:'2-digit'}).format(new Date(now));
const digest = token => createHash('sha256').update(token).digest('hex');
const conflict = e => e?.status === 409 || e?.status === 412 || e?.statusCode === 409 || e?.statusCode === 412 || /already exists|precondition/i.test(e?.message || '') || e?.name === 'BlobPreconditionFailedError';
const missing = e => e?.status === 404 || e?.statusCode === 404 || e?.name === 'BlobNotFoundError';

// One persistent aggregate; no per-visit blobs or recurring directory scans.
// Conditional writes prevent lost increments between concurrent Vercel instances.
export function createHandler({storage = {get, list, put}, clock = Date.now, configured = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID), pause = ms => new Promise(r => setTimeout(r, ms))} = {}) {
  let cached;
  let reading;
  async function legacy() {
    const state = {version:3, total:0, days:{}, sessions:{}};
    for (const prefix of ['dea-visitas/v1/', 'dea-visitas/v2/']) {
      let cursor;
      do {
        const page = await storage.list({prefix, limit:1000, ...(cursor ? {cursor} : {})});
        for (const blob of page.blobs) {
          const match = blob.pathname.match(/^dea-visitas\/v[12]\/(\d{4}-\d{2}-\d{2})\/([a-f0-9]{32})\.json$/);
          // Every previous visit is retained, including older filename formats.
          state.total++;
          const date = match?.[1] || blob.pathname.match(/\/(\d{4}-\d{2}-\d{2})\//)?.[1];
          if (date) state.days[date] = (state.days[date] || 0) + 1;
          if (match) {
            const stamp = new Date(blob.uploadedAt || date + 'T00:00:00Z').getTime();
            if (stamp > clock() - DAY) state.sessions[digest(match[2])] = stamp;
          }
        }
        cursor = page.hasMore ? page.cursor : undefined;
      } while (cursor);
    }
    return {state, etag:null};
  }
  async function read() {
    let result;
    try { result = await storage.get(PATH, {access:'private', useCache:false}); }
    catch (e) { if (!missing(e)) throw e; }
    if (!result) return legacy();
    const state = await new Response(result.stream).json();
    if (state.version !== 3 || !Number.isSafeInteger(state.total) || state.total < 0 || !state.days || !state.sessions || !result.blob.etag) throw Error('Invalid visit aggregate');
    return {state, etag:result.blob.etag};
  }
  function remember(state) { cached = {state, at:clock()}; }
  function result(state, registered) {
    const fecha = dayOf(clock());
    return {total:state.total, hoy:state.days[fecha] || 0, fecha, zona:'Europe/Madrid', ...(registered === undefined ? {} : {registrada:registered}), criterio:'Una nueva sesión tras 5 minutos de inactividad'};
  }
  return async function handler(req, res) {
    const send = (status, data) => {
      res.status(status);
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      if (status === 200 && req.method === 'GET') res.setHeader('Vercel-CDN-Cache-Control', 'public, s-maxage=60');
      res.end(JSON.stringify(data));
    };
    if (!['GET','POST'].includes(req.method)) {res.setHeader('Allow','GET, POST'); return send(405,{error:'Método no permitido'});}
    if (!configured()) return send(503,{error:'Contador no configurado'});
    const token = req.body?.session;
    if (req.method === 'POST' && (typeof token !== 'string' || !/^[a-f0-9]{32}$/.test(token))) return send(400,{error:'Identificador inválido'});
    if (req.method === 'POST' && req.headers?.origin && req.headers.origin !== 'https://' + req.headers.host) return send(403,{error:'Origen no permitido'});
    try {
      if (req.method === 'GET') {
        if (!cached || clock() - cached.at >= 60000) {
          reading ||= read().then(({state}) => {remember(state); return state;}).finally(() => {reading = null;});
          await reading;
        }
        return send(200, result(cached.state));
      }
      const id = digest(token);
      for (let attempt = 0; attempt < 8; attempt++) {
        const {state, etag} = await read();
        if (Object.hasOwn(state.sessions, id)) {remember(state); return send(200,result(state,false));}
        const now = clock(), today = dayOf(now);
        const sessions = Object.fromEntries(Object.entries(state.sessions).filter(([,stamp]) => stamp > now - DAY));
        sessions[id] = now;
        const next = {...state, total:state.total + 1, days:{...state.days, [today]:(state.days[today] || 0) + 1}, sessions};
        try {
          await storage.put(PATH, JSON.stringify(next), {access:'private', addRandomSuffix:false, contentType:'application/json', cacheControlMaxAge:60, ...(etag ? {ifMatch:etag} : {allowOverwrite:false})});
          remember(next);
          return send(200,result(next,true));
        } catch (e) {
          if (!conflict(e) || attempt === 7) throw e;
          await pause(20 * (attempt + 1) + Math.random() * 30);
        }
      }
    } catch (e) {
      console.error('DEA visits:', e?.name || 'StorageError', e?.message || 'storage failed');
      return send(503,{error:'No se pudieron consultar las visitas'});
    }
  };
}
export default createHandler();
