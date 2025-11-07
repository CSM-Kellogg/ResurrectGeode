/**
 * Mostly by ChatGPT with collaboration from Liam Kellogg and Grey Garner
 * 
 * Parses a catalog from a CSV file to an array. Also has search functionality for keywords.
*/

// Headers for the refactored catalog

const HEADERS_BY_CRN = [
    "campus", "mode", "medium", "section", "department", "courseNumber",
    "className", "credits", "attributes", "meetingTimes", "enrollment",
    "mutualExclusions", "CrossListedSections", "LinkedSections",
    "prerequisites", "courseDescription"
];

const HEADERS_BY_NAME = [
    "sections", "linked", "keywords", "keynumbers"
];

class Catalog {
    // The file to load the catalog from
    #catalogByCRNFile = "courseScheduler/catalogCRN.csv";
    #courseNameReferenceFile = "courseScheduler/courseLookup.csv";
    // The location in memory for the catalog data (by CRN)
    #catalogData = {};
    #searchable = [];

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
        this.#catalogData = await this.#buildObjFromArray(this.#catalogByCRNFile, HEADERS_BY_CRN);
        this.#searchable = await this.#buildObjFromArray(this.#courseNameReferenceFile, HEADERS_BY_NAME);

        console.log(this.#catalogData);
        console.log(this.#searchable);
    }

    // Builds a JSON object from a nested array using the first column as the key
    async #buildObjFromArray(fileName, entryKeys) {
        // Load in the csv with the course name as the first entry
        const res = await fetch(chrome.runtime.getURL(fileName));
        const text = await res.text();

        // Build this other object
        return text.split('\n').map((course) => {
            let outArray = JSON.parse(`[${course}]`);

            if (Object.keys(entryKeys).length != outArray.length - 1) {
                console.error("This is bad. The keys to describe the array disagree in length");
                console.log()
                return {};
            }

            let row = new Object();

            row[outArray[0]] = outArray.slice(1).reduce((acc, value, index) => {
                acc[entryKeys[index]] = value;
                return acc;
            });

            return row;
        });
    }

    // Searches by keyword
    // Currently, the keyword list is called every time. Ideally, this is some
    // column in the refactoredCatalog.csv that stores all keywords for a class
    // Also, some score needs to be attributed to each result for sorting reasons
    search(keyword) {
        let keywords = keyword.toLowerCase().split(/\s+/);

        // can search from a set of columns so long as they exist in the catalog data
        let result = this.#catalogData.filter(entry => {
            //console.log(entry);

            let conglomerateText = this.#searchable.keywords.filter(Boolean).join(' ');
            let conglomerateNumber = this.#searchable.keynumbers.filter(Boolean);

            const kwValue = keywords.every((keyword) =>
                conglomerateText.includes(keyword) ||
                conglomerateNumber.some((num) => num.match(new RegExp(`^${keyword}`)))
            );
            
            return kwValue;
        });

        return this.toExportFormat(result);
    }

    /**
     * O(1) time to find the course corresponding to a CRN
     * @param {int} crn  some CRN for a class
     * @returns The course object or null if not found
     */
    courseFromCRN(crn) {
        if (typeof crn === "number") crn = crn.toString();
        return this.toExportFormat(this.#catalogData[crn]);
    }

    /**
     * This is a patch: Go from new to old formatting for the "rich course object"
     */
    toExportFormat(newFormatCourse) {
        return newFormatCourse;
    }
}

// Create the singleton
const CatalogInstance = new Catalog();
export default CatalogInstance;