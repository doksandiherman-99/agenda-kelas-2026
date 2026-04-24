const APP_NAME = 'Agenda Kelas';
const REQUIRED_SHEETS = [
  'appConfig',
  'profile',
  'levels',
  'subjects',
  'classes',
  'holidays',
  'agendaSchedules',
  'educators',
  'students',
  'informations',
  'agendas',
  'dailyRecaps',
  'monthlyRecaps',
  'yearlyRecaps',
  'maintenance',
  'access',
];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    validateToken(body.token);
    const ss = getOrCreateSpreadsheet_();
    ensureSheets_(ss);

    if (body.action === 'getAll') {
      return jsonResponse_({ ok: true, payload: readAll_(ss), updatedAt: getLastUpdated_() });
    }

    if (body.action === 'upsertAll') {
      const lock = LockService.getScriptLock();
      lock.waitLock(30000);
      try {
        const serverUpdatedAt = getLastUpdated_();
        if (body.clientUpdatedAt && serverUpdatedAt && body.clientUpdatedAt !== serverUpdatedAt) {
          return jsonResponse_({
            ok: false,
            conflict: true,
            message: 'Data cloud sudah diperbarui user lain. Refresh data terlebih dahulu.',
            updatedAt: serverUpdatedAt,
          });
        }
        writeAll_(ss, body.payload || {});
        const updatedAt = touchUpdated_();
        return jsonResponse_({ ok: true, message: 'Synced', updatedAt: updatedAt });
      } finally {
        lock.releaseLock();
      }
    }

    return jsonResponse_({ ok: false, message: 'Unknown action' });
  } catch (error) {
    return jsonResponse_({ ok: false, message: String(error) });
  }
}

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : '';
  if (action === 'health') {
    return jsonResponse_({ ok: true, status: 'healthy', app: APP_NAME, updatedAt: getLastUpdated_() });
  }

  const ss = getOrCreateSpreadsheet_();
  ensureSheets_(ss);
  return ContentService.createTextOutput(
    JSON.stringify({
      ok: true,
      app: APP_NAME,
      spreadsheetId: ss.getId(),
      updatedAt: getLastUpdated_(),
      message: 'Apps Script Agenda Kelas aktif',
    }),
  ).setMimeType(ContentService.MimeType.JSON);
}

function getLastUpdated_() {
  return PropertiesService.getScriptProperties().getProperty('LAST_UPDATED_AT') || '';
}

function touchUpdated_() {
  const now = new Date().toISOString();
  PropertiesService.getScriptProperties().setProperty('LAST_UPDATED_AT', now);
  return now;
}

function validateToken(token) {
  const secret = PropertiesService.getScriptProperties().getProperty('APP_TOKEN');
  if (!secret) {
    throw new Error('APP_TOKEN belum diset di Script Properties');
  }
  if (token !== secret) {
    throw new Error('Token tidak valid');
  }
}

function getOrCreateSpreadsheet_() {
  const props = PropertiesService.getScriptProperties();
  const savedId = props.getProperty('SPREADSHEET_ID');
  if (savedId) {
    return SpreadsheetApp.openById(savedId);
  }
  const file = SpreadsheetApp.create(APP_NAME + ' Database');
  props.setProperty('SPREADSHEET_ID', file.getId());
  return file;
}

function ensureSheets_(ss) {
  REQUIRED_SHEETS.forEach(function (name) {
    if (!ss.getSheetByName(name)) {
      ss.insertSheet(name);
    }
  });
}

function readAll_(ss) {
  const result = {};
  REQUIRED_SHEETS.forEach(function (sheetName) {
    const sheet = ss.getSheetByName(sheetName);
    const value = sheet.getRange(1, 1).getValue();
    if (!value) {
      result[sheetName] = sheetName === 'appConfig' || sheetName === 'profile' || sheetName === 'maintenance' || sheetName === 'access' ? {} : [];
      return;
    }
    try {
      result[sheetName] = JSON.parse(value);
    } catch (error) {
      result[sheetName] = sheetName === 'appConfig' || sheetName === 'profile' || sheetName === 'maintenance' || sheetName === 'access' ? {} : [];
    }
  });

  return {
    appConfig: result.appConfig || {},
    profile: result.profile || {},
    levels: result.levels || [],
    subjects: result.subjects || [],
    classes: result.classes || [],
    holidays: result.holidays || [],
    agendaSchedules: result.agendaSchedules || [],
    educators: result.educators || [],
    students: result.students || [],
    informations: result.informations || [],
    agendas: result.agendas || [],
    dailyRecaps: result.dailyRecaps || [],
    monthlyRecaps: result.monthlyRecaps || [],
    yearlyRecaps: result.yearlyRecaps || [],
    maintenance: result.maintenance || {},
    access: result.access || {},
  };
}

function writeAll_(ss, payload) {
  const map = {
    appConfig: payload.appConfig || {},
    profile: payload.profile || {},
    levels: payload.levels || [],
    subjects: payload.subjects || [],
    classes: payload.classes || [],
    holidays: payload.holidays || [],
    agendaSchedules: payload.agendaSchedules || [],
    educators: payload.educators || [],
    students: payload.students || [],
    informations: payload.informations || [],
    agendas: payload.agendas || [],
    dailyRecaps: payload.dailyRecaps || [],
    monthlyRecaps: payload.monthlyRecaps || [],
    yearlyRecaps: payload.yearlyRecaps || [],
    maintenance: payload.maintenance || {},
    access: payload.access || {},
  };

  Object.keys(map).forEach(function (sheetName) {
    const sheet = ss.getSheetByName(sheetName);
    sheet.clear();
    sheet.getRange(1, 1).setValue(JSON.stringify(map[sheetName]));
  });
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}