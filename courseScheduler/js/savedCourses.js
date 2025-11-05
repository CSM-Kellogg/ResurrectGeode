/**
 * By: Liam Kellogg
 * 
 * A way to save the courses a student has selected. Uses googles local storage
 */

import { decodeHTML } from "./utils.js";
import { displayCourseContent } from './coursePopup.js';
import sectionSelector from './sectionSelector.js';

// Is signleton
class savedCourses {
    // Stores course in entirety
    parentNode = null;

    // Singleton constructor
    constructor() {
        // If it exists, no need to do anything else
        if (savedCourses._instance) return savedCourses._instance;
        
        // If it therefore not am, create a new instance and initialize it
        savedCourses._instance = this;
        this.courseList = [];
        this.courseMask = [];
        
        this.CRNMasks = new Object();

        // There MUST be a better way of handling this but I am unsure :(
        this.parentNode = document.getElementById('saved-courses').children[1];
        this.loadSavedCourses();
    }
    
    /**
     * 
     * @param {Course} course appends a course (in its entirety to the saved courses)
     */
    addCourse(course) {
        if (this.courseList.includes(course)) {
            console.log("course already added");
            return;
        }

        if (!this.CRNMasks) this.CRNMasks = new Object();

        this.courseList.push(course);
        this.courseMask.push(1);

        this.CRNMasks[course['class name']] = {};
        // Store as rich for technical issues in updateDisplay
        course.sectionListing.forEach((section) => {
            this.CRNMasks[course['class name']][section[0]] = true;
        })
        //this.CRNMasks[course['class name']] = new Array(course.sectionListing.length).fill(true); // Set every section to ON
        
        this.updateDisplay(this.parentNode);

        // Save to chrome storage
        chrome.storage.local.set({ savedCourses: this.courseList }, () => {
            console.log("Courses saved to storage");
        });
    }

    removeCourse(course) {
        // Find course by object name and delete it
        let atIndex = this.courseList.indexOf(course);

        if (atIndex == -1) {
            console.warn("Error removing course, course not found");
            console.log(course);
            console.log(this.courseList);
        } else {
            this.courseList.splice(atIndex, 1);
            this.courseMask.splice(atIndex, 1);
            delete this.CRNMasks[course['class name']];

            chrome.storage.local.set({ savedCourses: this.courseList }, () => {});
        }
    }

    loadSavedCourses() {
        chrome.storage.local.get(['savedCourses'], (result) => {
            if (result.savedCourses && Array.isArray(result.savedCourses)) {
                this.courseList = result.savedCourses;
                this.courseMask = new Array(this.courseList.length).fill(1);
                
                // This resets the CRN mask for every course.
                this.courseList.forEach((course) => {
                    this.CRNMasks[course['class name']] = {};
                    course.sectionListing.forEach((section) => {
                        this.CRNMasks[course['class name']][section[0]] = true;
                    })
                });
                
                this.updateDisplay(this.parentNode);
            }
        });
    }
    /**
     * 
     * @param {HTMLElement} parent Displays to the specified html element
     */
    updateDisplay(parent) {
        // Clear existing list
        parent.innerHTML = '';

        this.courseList.forEach((element, i) => {

            // Have to sort out this bug in searchCatalog
            let className = element['class name'];
            let decoded_name = decodeHTML(element['class name']);

            // Retrieve the template
            const template = document.getElementById('saved-course-table-template');
            const tableRow = template.content.cloneNode(true);

            // Add the content and event listeners.
            const nameBtn = tableRow.querySelector('td[data="name"] button');
            nameBtn.innerHTML = decoded_name;
            nameBtn.className = 'list-group-item list-group-item-action';
            nameBtn.addEventListener('click', () => {
                displayCourseContent(element); // Display some info
            });

            tableRow.querySelector('td[data="credits"]').innerHTML = element['credits'];
            
            let activeToggleBtn = tableRow.querySelector('td[data="toggler"] button');
            activeToggleBtn.addEventListener('click', () => {
                if (activeToggleBtn.innerHTML == 'ON') {
                    activeToggleBtn.innerHTML = 'OFF';
                    this.courseMask[i] = 0;
                } else {
                    activeToggleBtn.innerHTML = 'ON';
                    this.courseMask[i] = 1;
                }
            });

            // In the future, this will hold data for the active schedule in the generate courses window. This is the 
            // A user can select sections by professor and CRN to limit the number of sections. This is the "lock sections" feature.
            tableRow.querySelector('td[data="preferences"] button').addEventListener('click', (event) => {
                // Have a CRN selector as a popup and drag tool that saves the sections students would be willing to take
                // First, display
                sectionSelector.createNewPopup(element);
                // Second, onclick function
                let i = 0;
                sectionSelector.getFloatBox().querySelectorAll('tr').forEach((row) => {
                    // Skip header row
                    if (i == 0) {
                        i ++;
                        return;
                    }
                    
                    let rowCRN = row.childNodes[0].textContent;

                    this.#setSelectedColor(row.childNodes[0], this.CRNMasks[className][rowCRN]);

                    row.addEventListener('click', () => {

                        this.CRNMasks[className][rowCRN] = !this.CRNMasks[className][rowCRN]; // Invert selection
                        this.#setSelectedColor(row.childNodes[0], this.CRNMasks[className][rowCRN]);
                    });

                    row.addEventListener('contextmenu', () => {

                        console.log('hi u did not finish this')
                        // Reset isolation filter
                        if (this.CRNMasks[className][rowCRN]) {

                        }
                        // Set isolation filter
                        else {
                            // Toggle this one on
                            this.CRNMasks[className][rowCRN] = true;
                            this.#setSelectedColor(row.childNodes[0], true);
                        }
                    });

                    i ++;
                });
                // Third, interface with generateSchedules
                //console.log(element);
            });

            tableRow.querySelector('td[data="trash-course"] button').addEventListener('click', () => {
                this.removeCourse(element);
                this.updateDisplay(parent); // Call another update
            });

            parent.appendChild(tableRow);
        });
    }

    #setSelectedColor(DOMElem, state) {
        if (state) {
            DOMElem.style.backgroundColor = '#8fcc56';
        } else {
            DOMElem.style.backgroundColor = '#cc6056';
        }
    }

    updateCounter() {
        const counter = document.getElementById("schedule-counter");
        const prevBtn = document.getElementById("prev-schedule");
        const nextBtn = document.getElementById("next-schedule");

        const total = this.savedSchedules.length;
        const index = this.currentIndex + 1;

        if (counter) counter.textContent = `${index} / ${total}`;

        // Disable if only one or zero schedules
        const shouldDisable = total <= 1;
        if (prevBtn) prevBtn.disabled = shouldDisable;
        if (nextBtn) nextBtn.disabled = shouldDisable;
    }
    
    getActiveCourses() {
        let tmp = [];
        for (let i = 0; i < this.courseList.length; i ++) {
            if (this.courseMask[i] == 1) {
                tmp.push(this.courseList[i]);
            }
        }

        return tmp;
    }

    getActiveCRNs() {
        let tmp = [];
        Object.keys(this.CRNMasks).forEach((className) => {
            Object.keys(this.CRNMasks[className]).forEach((CRN) => {
                if (this.CRNMasks[className][CRN]) tmp.push(CRN);
            });
        });
        return tmp;
    }

    getCourses() {
        return this.courseList;
    }
}

const savedCourseInstance = new savedCourses();
export default savedCourseInstance;