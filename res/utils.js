// Takes stuff like &amp; out
export function decodeHTML(input) {
    const parser = new DOMParser();
    let prev, decoded = input;

    do {
        prev = decoded;
        const doc = parser.parseFromString(prev, "text/html");
        decoded = doc.documentElement.textContent;
    } while (decoded !== prev);

    return decoded;
}

// Gets an element using XPath. This project uses this as well as .querySelector()
export function getElem(someXPath) {
    const elem = document.evaluate(
        someXPath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;
    
    return elem
}

// Clicks a button given the XPath
export function safeClick(someXPath) {
    button = getElem(someXPath);
    
    if (button) {
        button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    } else {
        console.warn('Button not found.');
    }
}

// A promise with a timeout
export function waitFor(predicate, interval = 100, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();

        const check = () => {
            const result = predicate();
            if (result) {
                resolve(result);
                return;
            }

            if (Date.now() - startTime > timeout) {
                reject(new Error('waitFor: Timed out. Predicate shown above'));
                
                console.log(predicate);
                return;
            }
            setTimeout(check, interval);
        };
        check();
    });
}

// ChatGPT
export function download2DArray(data) {
    // Convert array to CSV string
    const csvContent = data.map(row => row.map(String)
            .map(value => `"${value.replace(/"/g, '""')}"`)  // CSV-safe quoting
            .join(',')
    ).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    // Create a URL that is clicked to download the URL
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}