/**
 * Mostly by ChatGPT with collaboration from Liam Kellogg and Grey Garner
 * 
 * Parses a catalog from a CSV file to an array. Also has search functionality for keywords.
*/

import { customSectionParser } from "./utils.js";

// Headers for the refactored catalog
// const HEADERS_OLD = [
//     "department", "coursenum", "class name", "credits", "pre-reqs",
//     "mutual exclusions", "coursedescription", "linkedCourses", "campus",
//     "schedType", "sectionListing"
// ];

const HEADERS = [
    "department", "coursenum", "class name", "credits", "pre-reqs",
    "mutual exclusions", "coursedescription", "linkedCourses", "campus",
    "schedType", "sectionListing" 
]

class Catalog {
    // The file to load the catalog from
    #catalogFile = "courseScheduler/refactoredCatalog.csv";
    // The location in memory for the catalog data
    #catalogData = [];

    // Singleton design principle.
    constructor() {
        // If it exists, no need to do anything else
        if (Catalog._instance) return Catalog._instance;
        
        // If it therefore not am, create a new instance and initialize it
        Catalog._instance = this;
        this.ready = this.#loadCatalog(); // Load in the catalog
    }

    // Loads in the catalog from file.
    async #loadCatalog() {
        const res = await fetch(chrome.runtime.getURL(this.#catalogFile));
        const text = await res.text();
        
        // Parse the text blob
        this.#catalogData = this.#parseCSV(text);
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
                console.log(`Row length was ${row.length} whilse header length was ${HEADERS.length}.`);
                return null;
            }
            
            // The dictionary for a certain row
            const obj = {};
            let isLinked = false;
            HEADERS.forEach((key, j) => {
                let value = row[j];

                if (key === "sectionListing") {
                    // Manual ish parser here. Wasn't able to use regex on this one.
                    const parsed = customSectionParser(value);
                    value = parsed;
                } else if (key === "linkedCourses") {
                    value = JSON.parse('['+value+']');
                    // Boolean for later
                    if (value[0] != null) isLinked = true;
                }

                obj[key] = value;
            });

            // Distinguish between linked classes in class name
            if (isLinked) {
                obj['class name'] += ` (${obj['schedType']})`;
            }

            return obj;
        });

        // Discard null rows and return
        return rows.filter(Boolean);
    }

    // Searches by keyword
    search(keyword) {
        const lcKeyword = keyword.toLowerCase();
        
        // keyword by class name for now
        // Eventually, maintain this sorted list such that it is easier to remove duplicates and it looks nicer

        let result = this.#catalogData.filter(entry => 
                entry["class name"]?.toLowerCase().includes(lcKeyword)
        );

        // Doesn't check for duplicates - needs a potential fix
        if (result.length < 4) {
            result.push(...this.#catalogData.filter(entry => 
                entry["department"]?.toLowerCase().includes(lcKeyword))
            );
        }

        

        return result;
    }

    /**
     * O(n) time to find the course corresponding to a CRN
     * @param {int} crn  some CRN for a class
     * @returns The course object or null if not found
     */
    courseFromCRN(crn) {
        let m_course = null;
        for (let i = 0; i < this.#catalogData.length; i ++) {
            for (let j = 0; j < this.#catalogData[i]["sectionListing"].length; j ++) {
                if (crn == parseInt(this.#catalogData[i]["sectionListing"][j][0])) {
                    return this.#catalogData[i];
                }
            }
        }
        return m_course;
    }
}

// Create the singleton
const CatalogInstance = new Catalog();
export default CatalogInstance;