/*
 * @Author: joe 
 * @Date: 2023-10-31 11:12:13
 * @LastEditTime: 2023-10-31 17:28:54
 * @LastEditors: joe 
 * @Description: 
 * @FilePath: \single\background.js
 */
import { loadSettings, getDefaultSettings } from './utils.js'

chrome.action.onClicked.addListener(() => {

    chrome.offscreen.createDocument({
        url: chrome.runtime.getURL("offscreen.html"),
        reasons: ["BLOBS"],
        justification: "justification is required.",
    }, () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.pageCapture.saveAsMHTML({ tabId: tabs[0].id }, async (md) => {
                const mdText = await md.text();
                chrome.runtime.sendMessage({ mdText: mdText }, (response) => {
                    const url = response.url;
                    chrome.downloads.download({
                        url: url,
                        filename: settings.downloadFile,
                        conflictAction: settings.conflictAction
                    });
                });
            });
        });
    });
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    loadSettings((res) => { updateSetting(res); });
});

var settings = getDefaultSettings();

function updateSetting(s) {
    settings = s;
}

loadSettings((res) => { updateSetting(res); });