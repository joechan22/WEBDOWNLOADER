chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const md = new Blob([message.mdText], { type: "application/html" });
    const url = URL.createObjectURL(md);
    sendResponse({ url: url });
    return true;
});