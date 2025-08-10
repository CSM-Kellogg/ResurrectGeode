/**
 * By: Grey Garner and ChatGPT
 * 
 * Tooltips! General tooltip class where the content is directly specified as raw HTML
 */

class Tooltip {
    constructor() {
        // If it exists, no need to do anything else
        if (Tooltip._instance) return Tooltip._instance;
        
        // If it therefore not am, create a new instance and initialize it
        Tooltip._instance = this;

        this.HTMLObj = null;
    }

    resetToolTip() {
        // Tooltip to view some class details (events added to schedule blocks)
        document.querySelectorAll('#custom-tooltip').forEach(el => el.remove());
        this.HTMLObj = document.createElement("div");
        this.HTMLObj.id = "custom-tooltip";
        document.body.appendChild(this.HTMLObj);
        this.HTMLObj.style.display = "none";
    }

    // Creates the tooltip and logic for mouse events.
    createTooltipEvents(parent, innerHTML) {
        this.HTMLObj.style.display = "block"; // Toggle display from none to block

        parent.addEventListener("mouseenter", () => {
            this.HTMLObj.innerHTML = innerHTML;
            this.HTMLObj.style.display = 'block';
        });
        
        parent.addEventListener("mousemove", (e) => {
            const tooltipRect = this.HTMLObj.getBoundingClientRect();
            const margin = 10;
            
            let left = e.clientX + 15;
            let top = e.clientY + 15;
            
            // If tooltip would go off the right edge
            if (left + tooltipRect.width + margin > window.innerWidth) {
                left = e.clientX - tooltipRect.width - 15;
            }
            
            // If tooltip would go off the bottom edge
            if (top + tooltipRect.height + margin > window.innerHeight) {
                top = e.clientY - tooltipRect.height - 15;
            }
            
            this.HTMLObj.style.left = `${left}px`;
            this.HTMLObj.style.top = `${top}px`;
        });
        
        parent.addEventListener("mouseleave", () => {
            this.HTMLObj.style.display = "none";
        });
    }

}

const toolTipInstance = new Tooltip();
export default toolTipInstance;