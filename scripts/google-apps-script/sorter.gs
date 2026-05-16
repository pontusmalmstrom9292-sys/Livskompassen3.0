/**
 * LivsKompassen - Sorteringstjänst för Kunskapsvalvet
 * Flyttar filer från 'Inbox' till 'Kunskapsvalvet' autonomt.
 */

const INBOX_FOLDER_ID = 'DITT_INBOX_FOLDER_ID';
const VAULT_FOLDER_ID = 'DITT_VAULT_FOLDER_ID';
const CLOUD_FUNCTION_URL = 'https://europe-west1-livskompassen-v2.cloudfunctions.net/notifyNewFile';

function autonomousSorter() {
  const inbox = DriveApp.getFolderById(INBOX_FOLDER_ID);
  const vault = DriveApp.getFolderById(VAULT_FOLDER_ID);
  const files = inbox.getFiles();

  while (files.hasNext()) {
    const file = files.next();
    const fileName = file.getName();
    const fileId = file.getId();

    console.log(`Bearbetar: ${fileName} (${fileId})`);

    // Flytta filen
    file.moveTo(vault);

    // Meddela Livskompassen Backend (för indexering/RAG)
    try {
      const response = UrlFetchApp.fetch(CLOUD_FUNCTION_URL, {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify({
          fileId: fileId,
          fileName: fileName,
          mimeType: file.getMimeType(),
          timestamp: new Date().toISOString()
        }),
        muteHttpExceptions: true
      });
      
      console.log(`Backend svar: ${response.getContentText()}`);
    } catch (e) {
      console.error(`Kunde inte meddela backend: ${e.toString()}`);
    }
  }
}

/**
 * Skapar en trigger som körs varje timme.
 */
function createTrigger() {
  ScriptApp.newTrigger('autonomousSorter')
    .timeBased()
    .everyHours(1)
    .create();
}
