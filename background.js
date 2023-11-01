/*
 * @Author: joe 
 * @Date: 2023-10-31 11:12:13
 * @LastEditTime: 2023-10-31 17:28:54
 * @LastEditors: joe 
 * @Description: 
 * @FilePath: \single\background.js
 */
import { loadSettings, getDefaultSettings } from './utils.js'

// global variables
var settings = getDefaultSettings();
let creating;
let offscreenPath = "offscreen.html";

async function setupOffscreenDocument(path) {
    const offscreenURL = chrome.runtime.getURL(path);
    const curContext = await chrome.runtime.getContexts({
        contextTypes: ['OFFSCREEN_DOCUMENT'],
        documentUrls: [offscreenURL]
    });

    if (curContext.length > 0)
        return;

    if (creating) {
        await creating;
    } else {
        creating = chrome.offscreen.createDocument({
            url: chrome.runtime.getURL("offscreen.html"),
            reasons: ["BLOBS"],
            justification: "justification is required.",
        });
        await creating;
        creating = null;
    }
}

function downloadHTML() {
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
}

chrome.action.onClicked.addListener(async () => {

    await setupOffscreenDocument(offscreenPath);

    downloadHTML();
});

chrome.runtime.onInstalled.addListener(function () {
    let parent = chrome.contextMenus.create({
        title: 'WEB DOWNLOADER',
        id: 'parent'
    });
    chrome.contextMenus.create({
        title: 'download',
        parentId: parent,
        id: 'child1'
    });
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
    loadSettings((res) => { updateSetting(res); });
});

// callback function for the context manu
chrome.contextMenus.onClicked.addListener(actioncOnClick);

async function actioncOnClick(info) {
    switch (info.type) {
        default:
            await setupOffscreenDocument(offscreenPath);
            downloadHTML();
    }
}

function updateSetting(s) {
    settings = s;
}

loadSettings((res) => { updateSetting(res); });