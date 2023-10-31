/*
 * @Author: joe 
 * @Date: 2023-10-31 14:34:35
 * @LastEditTime: 2023-10-31 15:53:51
 * @LastEditors: joe 
 * @Description: 
 * @FilePath: \single\utils.js
 */
export function getDefaultSettings() {
    var settings = {};
    settings.downloadFile = 'web.html';
    settings.conflictAction = 'overwrite';
    return settings;
}

export function loadSettings(callback) {
    var settings = getDefaultSettings();
    // var keys = [];
    // for (var key in settings) { keys.push(key); }

    storage.load(settings, (res) => {
        callback(res);
    });
}

export const storage = {
    useSync: true,
    api: function() {
        var s = chrome.storage;
        if (s)
            return (storage.useSync === true) ? s.sync : s.local;
    },
    save: function(ds, callback) {
        var s = this.api();
        if (s)
            s.set(ds, callback);
        else
            callback();
    },
    load: function(key, callback) {
        var s = this.api();
        if (s)
            s.get(key, callback);
        else
            callback();
    }
}