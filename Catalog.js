/**
* Boiler plate for singleton by ChatGPT
* 
*/

class Catalog {
    #catalogFile = "catalog.csv";
    #catalogData = [];

    constructor() {
        if (Catalog._instance) return Catalog._instance;
        Catalog._instance = this;

        this.#loadCatalog();
    }

    async #loadCatalog() {
        const res = await fetch(chrome.runtime.getURL(this.#catalogFile));
        const text = await res.text();
        console.log("About to assign parsed catalog");
        this.#catalogData = this.#parseCSV(text);
        console.log("Parsed Catalog:", this.#catalogData);
        console.log("Parsed Catalog sample:", this.#catalogData[0]);
        console.log("Available keys:", Object.keys(this.#catalogData[0]));
    }
    #parseCSV(text) {
        const HEADERS = [
            "crn", "campus", "schedule type", "instructional method", "section",
            "department", "coursenum", "class name", "credits", "pre-reqs",
            "mutual exclusions", "coursedescription", "professor", "professor email",
            "meetingdays", "meetingrange", "timeofday", "roomnum"
        ];
    
        const parsed = Papa.parse(text, {
            header: false,
            skipEmptyLines: true
        });
    
        const rows = parsed.data.map((row, i) => {
            if (row.length !== HEADERS.length) {
                console.warn(`Row ${i + 1} length mismatch. Skipping.`, row);
                return null;
            }
    
            const obj = {};
            HEADERS.forEach((key, j) => {
                obj[key] = row[j];
            });
            return obj;
        });
    
        return rows.filter(Boolean);
    }
    
    
    

    search(keyword) {
        const lcKeyword = keyword.toLowerCase();
        return this.#catalogData.filter(entry =>
            entry["class name"]?.toLowerCase().includes(lcKeyword)
        );
    }
}

const CatalogInstance = new Catalog();
export default CatalogInstance;