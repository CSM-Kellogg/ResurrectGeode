export function decodeHTML(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;

    // repeat until necessary
    if (txt.value != html) {
        return decodeHTML(txt.value);
    }
    return txt.value;
}


export function customSectionParser(txtbob) {
    let output = [[]];
    let curr_element = "";
    let inString = false;
    let isSingleQuote = false;

    for(let i = 0; i < txtbob.length; i ++) {
        switch(txtbob[i]) {
            case '\\':
                //escape!
                i ++;
                curr_element += txtbob[i];
                break;
            case '[':
                if (inString) {
                    curr_element += '[';
                }
                // No need
                break;
            case ']':
                if (inString) {
                    curr_element += ']';
                } else {
                    // New element (maybe idk)
                    output.push([]);
                }
                break;
            case "'":
                if (inString) {
                    if (isSingleQuote) {
                        output[output.length - 1].push(curr_element);
                        inString = false;
                    } else {
                        curr_element += "'";
                    }
                } else {
                    inString = true;
                    isSingleQuote = true;
                }
                break;
            case '"':
                if (inString) {
                    if (!isSingleQuote) {
                        output[output.length - 1].push(curr_element);
                        inString = false;
                    } else {
                        curr_element += '"';
                    }
                } else {
                    inString = true;
                    isSingleQuote = false;
                }
                break;
            case ',':
                if (inString) {
                    curr_element += ',';
                } else {
                    curr_element = '';
                }
                break;
            default:
                if (inString) {
                    curr_element += txtbob[i];
                }
        }
    }
    output.pop(); // Gets rid of empty []
    output.pop();
    return output;
}