export function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;

    // repeat until necessary
    if (txt.value != html) {
        return decodeHTML(txt.value);
    }
    return txt.value;
}