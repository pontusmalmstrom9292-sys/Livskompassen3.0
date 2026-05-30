/**
 * LivsKompassen — Drive Inbox → Vault sorter + webhook till Cloud Functions
 *
 * SETUP (engångs, Apps Script UI):
 * 1. Project Settings → Script Properties:
 *    - INBOX_FOLDER_ID     — Google Drive folder ID för Inbox
 *    - VAULT_FOLDER_ID     — Google Drive folder ID för Kunskapsvalvet
 *    - WEBHOOK_SECRET      — samma värde som Firebase NOTIFY_WEBHOOK_SECRET
 *    - CLOUD_FUNCTION_URL  — (valfritt) notifyNewFile-URL; default nedan
 *    - FIREBASE_OWNER_UID  — Firebase Auth uid → webhook ownerUid + ownerId (kb_docs)
 * 2. Klistra in detta script, spara, kör createTrigger() en gång.
 * 3. Dela Vault-mappen med Functions service account (se docs/DRIVE_AUTOMATION.md).
 *
 * OBS: Gammal version pekade på livskompassen-v2 — använd gen-lang-client-0481875058.
 */

var DEFAULT_CLOUD_FUNCTION_URL =
  'https://europe-west1-gen-lang-client-0481875058.cloudfunctions.net/notifyNewFile';

function getScriptConfig_() {
  var props = PropertiesService.getScriptProperties();
  return {
    inboxFolderId: props.getProperty('INBOX_FOLDER_ID'),
    vaultFolderId: props.getProperty('VAULT_FOLDER_ID'),
    cloudFunctionUrl: props.getProperty('CLOUD_FUNCTION_URL') || DEFAULT_CLOUD_FUNCTION_URL,
    webhookSecret: props.getProperty('WEBHOOK_SECRET'),
    ownerUid: props.getProperty('FIREBASE_OWNER_UID')
  };
}

function autonomousSorter() {
  var config = getScriptConfig_();

  if (!config.inboxFolderId || !config.vaultFolderId) {
    throw new Error('INBOX_FOLDER_ID och VAULT_FOLDER_ID måste sättas i Script Properties.');
  }

  var inbox = DriveApp.getFolderById(config.inboxFolderId);
  var vault = DriveApp.getFolderById(config.vaultFolderId);
  var files = inbox.getFiles();

  while (files.hasNext()) {
    var file = files.next();
    var fileName = file.getName();
    var fileId = file.getId();

    console.log('Bearbetar: ' + fileName + ' (' + fileId + ')');

    file.moveTo(vault);

    try {
      var payload = {
        fileId: fileId,
        fileName: fileName,
        mimeType: file.getMimeType(),
        timestamp: new Date().toISOString()
      };

      if (config.ownerUid) {
        payload.ownerUid = config.ownerUid;
        payload.ownerId = config.ownerUid;
      }

      var options = {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      };

      if (config.webhookSecret) {
        options.headers = {
          'X-Livskompassen-Webhook-Secret': config.webhookSecret
        };
      } else {
        console.warn(
          'WEBHOOK_SECRET saknas i Script Properties — notifyNewFile svarar 401/503 i produktion.'
        );
      }

      var response = UrlFetchApp.fetch(config.cloudFunctionUrl, options);
      if (response.getResponseCode() >= 400) {
        console.error(
          'Backend fel ' + response.getResponseCode() + ': ' + response.getContentText()
        );
      }
      console.log('Backend svar: ' + response.getContentText());
    } catch (e) {
      console.error('Kunde inte meddela backend: ' + e.toString());
    }
  }
}

/**
 * Listar alla triggers i projektet (kör manuellt → Executions / logg).
 */
function listTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  if (triggers.length === 0) {
    console.log('Inga triggers i projektet.');
    return;
  }
  triggers.forEach(function (trigger, index) {
    console.log(
      index +
        1 +
        '. ' +
        trigger.getHandlerFunction() +
        ' (id=' +
        trigger.getUniqueId() +
        ')'
    );
  });
  console.log('Totalt: ' + triggers.length + ' / 20 (Google-gräns per script).');
}

/**
 * Tar bort alla triggers för autonomousSorter (behåller övriga triggers).
 */
function deleteSorterTriggers() {
  var removed = deleteTriggersForHandler_('autonomousSorter');
  console.log('Borttagna autonomousSorter-triggers: ' + removed);
}

/**
 * Tar bort ALLA triggers i projektet. Använd vid "too many triggers".
 */
function deleteAllTriggers() {
  var triggers = ScriptApp.getProjectTriggers();
  var count = triggers.length;
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  console.log('Borttagna triggers: ' + count);
}

function deleteTriggersForHandler_(handlerName) {
  var triggers = ScriptApp.getProjectTriggers();
  var removed = 0;
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === handlerName) {
      ScriptApp.deleteTrigger(triggers[i]);
      removed++;
    }
  }
  return removed;
}

/**
 * Skapar en timtrigger — idempotent (rensar gamla autonomousSorter-triggers först).
 * Kör en gång efter Script Properties. Vid "too many triggers": kör deleteAllTriggers() först.
 */
function createTrigger() {
  var removed = deleteTriggersForHandler_('autonomousSorter');
  if (removed > 0) {
    console.log('Rensade ' + removed + ' gammal(a) autonomousSorter-trigger(s).');
  }

  ScriptApp.newTrigger('autonomousSorter')
    .timeBased()
    .everyHours(1)
    .create();

  console.log('Timtrigger skapad för autonomousSorter.');
}
