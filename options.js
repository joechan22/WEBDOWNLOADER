/*
 * @Author: joe 
 * @Date: 2023-10-31 11:17:50
 * @LastEditTime: 2023-10-31 17:19:33
 * @LastEditors: joe 
 * @Description: 
 * @FilePath: \single\options.js
 */
// Saves options to chrome.storage

import {loadSettings, storage} from './utils.js'

const saveOptions = () => {
    const filename = document.getElementById('filename').value;
    const conflict = document.getElementById('conflict').value;

    storage.save({ downloadFile: filename, conflictAction: conflict }, () => {
        const status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(() => {
            status.textContent = '';
        }, 500);
    })
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {

    loadSettings((res) => {
        document.getElementById('filename').value = res.downloadFile;
        document.getElementById('conflict').value = res.conflictAction;
    });

};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);