/**
 * By: Liam Kellogg
 * 
 * @param {string} data 
 * @param {header (true/false)} options 
 * @returns list
 * 
 * Usage: returns an array from a string formatted in csv
 */

function CSVParse(data, options = {header: false}) {
    let useHeader;
    useHeader = options.header;

    if (useHeader) {
        console.warn("Header should be used");
    }

    // Parse the text file
    m_CSV = [[]];
    datum = "";
    inString = false;
    currentRow = 0;
    for (i = 0; i < data.length; i ++) {
        switch(data[i]) {
            case '\\': // Escape next character and process it
                i ++;
                datum.append(data[i])
                break;
            case '\"': // Begin/end string
            case '\'': // Could be this as well
                inString = !inString;
                break;
            case '\n': // Row is done
                if (inString) {
                    datum.push(data[i]);
                } else {
                    currentRow ++;
                }
                break;
            case ',': // column done
                if (inString) {
                    datum.push(data[i]);
                } else {
                    m_CSV[currentRow].push(datum);
                    datum = "";
                }
                break;
            default: // Is a regular bum-ass character
                break;
        }
    }

    return m_CSV;
}

export default CSVParse;