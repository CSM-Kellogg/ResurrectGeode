class sectionSelector {
    constructor() {
        if (sectionSelector._instance) return sectionSelector._instance;
        sectionSelector._instance = this;
        
        this.selectedSections = [];
        this.floatBox = null;
        this.floatBoxID = 'section-selector-popup';
    }

    setupFloatBox() {
        let floatBox = document.createElement('div');
        floatBox.id = this.floatBoxID;
        floatBox.display = 'none';
        floatBox.className = "floating-box resize-drag";

        return floatBox;
    }

    // course is a rich-info object containing section data
    createNewPopup(course) {
        if (document.querySelector(`#${this.floatBoxID}`)) {
            this.floatBox.innerHTML = '';
        } else {
            this.floatBox = this.setupFloatBox();
        }

        // Close button and header using a template in scheduler.html
        const template = document.getElementById("course-header-template");
        const header = template.content.cloneNode(true);

        header.querySelector(".close-btn").onclick = () => this.floatBox.remove();
        header.querySelector('h5').textContent = `Section info for: ${course['class name']}`;
        header.querySelector('#add-course-btn').remove();

        this.floatBox.appendChild(header);
        
        // Body of the info box
        const infoArea = document.createElement('div');
        this.floatBox.appendChild(infoArea);

        let dataObj = {};
        // Format the JSON object to shove into a table
        course.sectionListing.forEach((section) => {
            let crn = section[0][0]; // Take the first meeting time
            let sectionData = {
                "Professor": section[0][3]
            };
            dataObj[crn] = sectionData;
        });

        let dataTable = this.#createTableFromData(dataObj);
        infoArea.appendChild(dataTable);

        document.body.appendChild(this.floatBox);
    }

    // Thanks gemini
    #createTableFromData(dataObj) {
    
        // 1. Convert object-of-objects to array-of-objects for easier iteration
        // The key (1, 2, etc.) is implicitly the ID/Row Header
        const dataArray = Object.keys(dataObj).map(key => ({
            'CRN': key, // Adding the key as a column named 'ID'
            ...dataObj[key]
        }));

        // 2. Get the column headers from the first object
        const headers = Object.keys(dataArray[0]);

        // 3. Create table elements
        const table = document.createElement('table');
        // Apply essential Bootstrap classes for styling
        table.classList.add('table', 'table-striped', 'table-bordered', 'table-hover'); 

        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // --- Create Table Header (<thead>) ---
        const headerRow = document.createElement('tr');
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // --- Create Table Body (<tbody>) ---
        dataArray.forEach(rowData => {
            const row = document.createElement('tr');
            headers.forEach(headerKey => {
                const td = document.createElement('td');
                // Use the header key to get the corresponding value from the row data
                td.textContent = rowData[headerKey]; 
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });

        // 4. Assemble and display the table
        table.appendChild(thead);
        table.appendChild(tbody);

        return table;
    }

    getSelection() {
        return this.selectedSections;
    }

    getFloatBox() {
        return this.floatBox;
    }
}

const sectionSelectorInstance = new sectionSelector();
export default sectionSelectorInstance;