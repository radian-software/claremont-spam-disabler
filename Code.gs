const SPAM_SUBJECT = "Claremont Colleges Blocked Spam Summary";

function main() {
  for (const thread of GmailApp.getInboxThreads()) {
    if (thread.getFirstMessageSubject() === SPAM_SUBJECT) {
      let wasSuccessful = true;
      for (const message of thread.getMessages()) {
        if (message.getSubject() === SPAM_SUBJECT && message.isInInbox()) {
          for (const match of message.getPlainBody().matchAll(/<(https:\/\/[^>]+action=Release[^>]+)>/g)) {
            const link = match[1];
            console.log("Fetching:", link);
            const resp = UrlFetchApp.fetch(link);
            if (resp.getResponseCode() !== 200) {
              console.log("Unexpected status code:", resp.getResponseCode());
              wasSuccessful = false;
            }
          }
        }
      }
      if (wasSuccessful) {
        console.log("All messages released; deleting thread.");
        thread.moveToTrash();
      } else {
        console.log("Since there were errors, leaving thread in inbox.");
      }
    }
  }
}
