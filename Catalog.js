/**
* Mostly by ChatGPT with collaboration from Liam Kellogg and Grey Garner
* 
*/

// Headers for the refactored catalog
const HEADERS = [
    "department", "coursenum", "class name", "credits", "pre-reqs",
    "mutual exclusions", "coursedescription", "campus", "sectionListing"
];

class Catalog {
    // The file to load the catalog from
    #catalogFile = "refactoredCatalog.csv";
    // The location in memory for the catalog data
    #catalogData = [];

    // Singleton design principle.
    constructor() {
        // If it exists, no need to do anything else
        if (Catalog._instance) return Catalog._instance;
        
        // If it therefore not am, create a new instance and initialize it
        Catalog._instance = this;
        this.#loadCatalog(); // Load in the catalog
    }

    // Loads in the catalog from file.
    async #loadCatalog() {
        const res = await fetch(chrome.runtime.getURL(this.#catalogFile));
        const text = await res.text();
        
        // Parse the text blob
        this.#catalogData = this.#parseCSV(text);

        // Some debug
        // console.log("Parsed Catalog:", this.#catalogData);
        // console.log("Parsed Catalog sample:", this.#catalogData[0]);
        // console.log("Available keys:", Object.keys(this.#catalogData[0]));
    }
    
    // Parses a CSV using PapaParse
    #parseCSV(text) {
        // Parse the text blob using PapaParse
        const parsed = Papa.parse(text, {
            header: false,
            skipEmptyLines: true
        });
        
        // Create a searchable dictionary by column headers
        const rows = parsed.data.map((row, i) => {
            // Validate row lengths to be equal to header length
            if (row.length !== HEADERS.length) {
                console.warn(`Row ${i + 1} length mismatch. Skipping.`, row);
                return null;
            }
            
            // The dictionary for a certain row
            const obj = {};
            HEADERS.forEach((key, j) => {
                obj[key] = row[j];
            });
            return obj;
        });

        /**
         * TODO
         * Merge same class names and create sections --- DONE
         * Make a seperate window to view all the sections
         */

        // Discard null rows and return
        return rows.filter(Boolean);
    }

    // Searches by keyword
    search(keyword) {
        const lcKeyword = keyword.toLowerCase();
        
        // keyword by class name for now
        return this.#catalogData.filter(entry =>
            entry["class name"]?.toLowerCase().includes(lcKeyword)
        );
    }
}

const CatalogInstance = new Catalog();
export default CatalogInstance;