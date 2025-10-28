/**
 * By: Liam Kellogg and AI
 * 
 * This is where a lot of the helper methods and global variables are stored.
 * This script gets injected into all ellucian webpages but cannot be for all
 * "chrome://*". That's because of a security thing. So, for the Geode Scheduler,
 * this has to be manually referenced.
 */

console.log('utils script loaded');

// Credit: https://stackoverflow.com/questions/30008114/how-do-i-promisify-native-xhr
async function makeRequest (method, url, body=null, contentType=null, headers=null) {
    var xhr = null;
    await new Promise(function (resolve, reject) {
        xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: xhr.status,
                statusText: xhr.statusText
            });
        };
        
        // Optional Header
        if (contentType != null) {
            xhr.setRequestHeader("Content-Type", contentType);
        }

        // Optional other headers as JSON object
        if (headers != null) {
            let keys = Object.keys(headers);
            let values = Object.values(headers);

            for (let i = 0; i < keys.length; i ++) {
                xhr.setRequestHeader(keys[i], values[i]);
            }
        }
        
        xhr.send(body);
    });
    
    return xhr;
}

// Clicks a button given the XPath
function safeClick(DOMelement) {
    
    if (DOMelement) {
        DOMelement.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    } else {
        console.warn('Button not found.');
    }
}

/**
 * Wait until the provided predicate function returns true.
 *
 * Usage:
 *   // wait until an element exists
 *   await waitFor(() => !!document.querySelector('#createPlan'), { timeout: 5000 });
 *
 * Parameters:
 *   - predicate: a function that returns a boolean or a Promise<boolean>.
 *   - options: { timeout?: number, pollInterval?: number }
 *
 * Resolves to true when predicate becomes truthy, or false when the timeout expires.
 *
 * @param {() => boolean|Promise<boolean>} predicate
 * @param {{timeout?: number, pollInterval?: number}} options
 * @returns {Promise<boolean>}
 */
function waitFor(predicate, options = {}) {
    const { timeout = 5000, pollInterval = 100 } = options;

    if (typeof predicate !== 'function') {
        return Promise.reject(new TypeError('waitFor: predicate must be a function'));
    }

    let observer = null;
    let intervalId = null;

    function checkPredicate() {
        try {
            const res = predicate();
            if (res && typeof res.then === 'function') {
                // predicate returned a Promise
                return res.then(Boolean).catch(() => false);
            }
            return Promise.resolve(Boolean(res));
        } catch (err) {
            return Promise.resolve(false);
        }
    }

    return new Promise((resolve) => {
        // immediate check
        checkPredicate().then((ok) => {
            if (ok) {
                resolve(true);
                return;
            }

            // Setup MutationObserver to catch DOM changes quickly
            try {
                observer = new MutationObserver(() => {
                    checkPredicate().then((ok2) => {
                        if (ok2) {
                            if (observer) observer.disconnect();
                            if (intervalId) clearInterval(intervalId);
                            clearTimeout(timer);
                            resolve(true);
                        }
                    });
                });

                observer.observe(document.documentElement || document, { childList: true, subtree: true, attributes: true });
            } catch (e) {
                // If MutationObserver is not available, fall back to polling only
                observer = null;
            }

            // Polling fallback for environments where MutationObserver misses something
            intervalId = setInterval(() => {
                checkPredicate().then((ok3) => {
                    if (ok3) {
                        if (observer) observer.disconnect();
                        clearInterval(intervalId);
                        clearTimeout(timer);
                        resolve(true);
                    }
                });
            }, pollInterval);

            const timer = setTimeout(() => {
                if (observer) observer.disconnect();
                if (intervalId) clearInterval(intervalId);
                resolve(false);
            }, timeout);
        });
    });
}