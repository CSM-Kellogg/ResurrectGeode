export class breakManager {

    constructor() {
        if (breakManager._instance) return breakManager._instance;

        // If it therefore not am, create a new instance and initialize it
        breakManager._instance = this;
        
        this.breakBlocks = []
        this.editMode = false;
        this.enableBreakSelection();
    }

    addBreakBlock(day, start, end) {
        this.breakBlocks.push({ day: day, start, end });
    }

    clearBreaks() {
        this.breakBlocks = [];
    }

    display() {
        document.querySelectorAll(".break-block").forEach(el => el.remove());

        this.breakBlocks.forEach(({ day, start, end }, i) => {
            const startHour = Math.floor(start / 60);
            const startMin = start % 60;
            const cell = document.querySelector(`[data-day="${day}"][data-time="${startHour}:${startMin}"]`);
            if (!cell) return;
            
            const duration = end - start;
            const height = ((duration) / 15) * cell.offsetHeight;
            
            const block = document.createElement("div");
            block.className = "break-block";
            block.style.height = `${height}px`;
            block.textContent = "Break";

            // Remove break at index
            block.addEventListener("click", () => {
                this.breakBlocks.splice(i, 1);
            });
            
            cell.appendChild(block);
        });
    }

    enableBreakSelection() {
        let startCell = null;
        let visAid = null;
        
        const cells = document.querySelectorAll("td.day-slot");
        const daZone = document.querySelector('#right-column');

        // Clears state of the edit mode
        function clearState() {
            startCell.classList.remove("selected-break-start");
            startCell = null;
            daZone.removeChild(visAid);
        }

        function init(cell) {
            // First click = start
            startCell = cell;
            // The div to act as a visual aid
            visAid = document.createElement('div');
            visAid.className = 'break-edit-visaid';

            daZone.appendChild(visAid);

            cell.classList.add("selected-break-start");

            // Make the existing blocks non-toggleable
            document.querySelectorAll(".break-block").forEach((block) => {
                block.style.setProperty("pointer-events", "none", "important");
            });
        }

        function store(cell, breakBlocks) {
            let d1 = parseInt(startCell.dataset.day);
            let d2 = parseInt(cell.dataset.day);

            // For each day in the selected range, add a break
            for (let i = Math.min(d1, d2); i < Math.max(d1, d2) + 1; i ++) {
                const [h1, m1] = startCell.dataset.time.split(':').map(Number);
                const [h2, m2] = cell.dataset.time.split(':').map(Number);
                const start = Math.min(h1 * 60 + m1, h2 * 60 + m2);
                const end = Math.max(h1 * 60 + m1, h2 * 60 + m2) + 15; // include clicked cell
                
                // merge overlap
                let mergedBlock;
                if (mergedBlock = breakBlocks.find(block => block.day == i &&
                    (block.start <= start || block.end >= end))) {

                    mergedBlock.start = Math.min(mergedBlock.start, start);
                    mergedBlock.end = Math.max(mergedBlock.end, end);
                } else {
                    breakBlocks.push({ day: i, start, end });
                }
            }

            // Make the blocks edit-able again
            document.querySelectorAll(".break-block").forEach((block) => {
                block.style.pointerEvents = "all";
            });
        }

        cells.forEach(cell => {
            // Chat GPT lies. Use mousePressed instead i think
            // cell.addEventListener("dragenter", () => {
            //     console.log('hi');
            //     if (!this.editMode) return;

            //     //init(cell);
            // });

            cell.addEventListener("click", () => {
                if (!this.editMode) return;

                if (!startCell) {
                    init(cell);
                    return;
                }
                
                store(cell, this.breakBlocks);

                // Clear state
                clearState();
            });

            // Visual aid
            cell.addEventListener("mouseover", () => {
                if (!this.editMode || !startCell) return;

                let endX = cell.getBoundingClientRect().right;
                let endY = cell.getBoundingClientRect().bottom;

                let originX = startCell.getBoundingClientRect().left;
                let originY = startCell.getBoundingClientRect().top;

                if (endY <= originY) {
                    originY = cell.getBoundingClientRect().top;
                    endY = startCell.getBoundingClientRect().bottom;
                }

                if (endX <= originX) {
                    originX = cell.getBoundingClientRect().left;
                    endX = startCell.getBoundingClientRect().right;
                }

                visAid.style.top = `${originY}px`;
                visAid.style.left = `${originX}px`;
                visAid.style.width = `${endX - originX}px`;
                visAid.style.height = `${endY - originY}px`;
            });
        });
        
        // Clear on outside click
        document.addEventListener("click", (e) => {
            if (!e.target.closest("td.day-slot") && startCell) {
                clearState();
            }
        });
    }

    toggleMode() {
        this.editMode = !this.editMode;
    }

    getBreakBlocks() {
        return this.breakBlocks;
    }

    getMode() {
        return this.editMode;
    }
}

// Create the singleton
const breakManagerInstance = new breakManager();
export default breakManagerInstance;