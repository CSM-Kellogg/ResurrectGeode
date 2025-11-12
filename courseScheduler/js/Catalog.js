/**
 * Mostly by ChatGPT with collaboration from Liam Kellogg and Grey Garner
 * 
 * Parses a catalog from a CSV file to an array. Also has search functionality for keywords.
*/

// Headers for the refactored catalog

const HEADERS_BY_CRN = [
    "campus", "schedType", "medium", "section", "department", "coursenum",
    "class name", "credits", "attributes", "meetingTimes",
    "mutual exclusions", "CrossListedSections", "linkedCourses",
    "pre-reqs", "coursedescription"
];

const HEADERS_BY_NAME = [
    "sections", "linked", "keywords", "keynumbers"
];

const HEADERS_OLD = [
    "department", "coursenum", "class name", "credits", "pre-reqs",
    "mutual exclusions", "coursedescription", "linkedCourses", "campus",
    "schedType", 
];

class Catalog {
    // The file to load the catalog from
    #catalogByCRNFile = "courseScheduler/catalogCRN.csv";
    #courseNameReferenceFile = "courseScheduler/courseLookup.csv";
    // The location in memory for the catalog data (by CRN)
    #catalogData = {};
    #catalogByName = {};

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
        this.#catalogByName = await this.#buildObjFromArray(this.#courseNameReferenceFile, HEADERS_BY_NAME);

        //console.log(this.toExportFormat(this.#catalogData['10004']));
    }

    // Builds a JSON object from a nested array using the first column as the key
    async #buildObjFromArray(fileName, entryKeys) {
        // Load in the csv with the course name as the first entry
        const res = await fetch(chrome.runtime.getURL(fileName));
        const text = await res.text();

        // object to return
        let output = {};

        // Build the object
        text.split('\n').forEach((course) => {
            let outArray = JSON.parse(`[${course}]`);

            if (Object.keys(entryKeys).length != outArray.length - 1) {
                console.error("This is bad. The keys to describe the array disagree in length");
                console.log()
                return {};
            }

            output[outArray[0]] = outArray.slice(1).reduce((accumulator={}, value, index) => {
                accumulator[entryKeys[index]] = value;
                return accumulator;
            }, new Object());
        });

        return output;
    }

    // Searches by keyword
    // Currently, the keyword list is called every time. Ideally, this is some
    // column in the refactoredCatalog.csv that stores all keywords for a class
    // Also, some score needs to be attributed to each result for sorting reasons
    search(keyword) {
        let keywords = keyword.toLowerCase().split(/\s+/);

        // can search from a set of columns so long as they exist in the catalog data
        let result = Object.entries(this.#catalogByName).filter(entry => {

            let conglomerateText = entry[1].keywords.join(' ');
            let conglomerateNumber = entry[1].keynumbers;

            const kwValue = keywords.every((keyword) =>
                conglomerateText.includes(keyword) ||
                conglomerateNumber.some((num) => num.match(new RegExp(`^${keyword}`)))
            );
            
            return kwValue;
        });

        return result.map((elem) => this.toExportFormat(this.#catalogData[elem[1].sections[0]])); // take the first section from the result
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
    toExportFormat(formattedCourse) {
        let output = {};

        HEADERS_OLD.forEach((header) => {
            output[header] = formattedCourse[header];
        });

        // Add the section listing
        let sectionList = this.#catalogByName[`${formattedCourse['class name']}`].sections;

        let sections = sectionList.map((crn) => {
            let section = this.#catalogData[crn];
            let meetingTimes = section.meetingTimes;
            
            return meetingTimes.map((meeting) => {
                return [
                    crn, section.medium, section.section, meeting[0],
                    meeting[1], meeting[2].join(','), meeting[3].join(','),
                    meeting[4].join(','), meeting[5][0]
                ];
            });
        }).filter((item) => item.length > 0);
        output['sectionListing'] = sections;

        return output;
    }
}

// Create the singleton
const CatalogInstance = new Catalog();
export default CatalogInstance;