
/**
 * Creates events for a standard tooltip
 * @param {HTMLElement} parent The parent element to attach the tooltip to
 * @param {HTMLELEMENT} tooltipObj The tooltip object
 * @param {string} innerHTML What the innerHTML of the tooltip object will contain
 */
export function createTooltipEvents(parent, tooltipObj, innerHTML) {
    
    parent.addEventListener("mouseenter", () => {
        tooltipObj.innerHTML = innerHTML;
        tooltipObj.style.display = 'block';
    });
    
    parent.addEventListener("mousemove", (e) => {
        const tooltipRect = tooltipObj.getBoundingClientRect();
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
        
        tooltipObj.style.left = `${left}px`;
        tooltipObj.style.top = `${top}px`;
    });
    
    parent.addEventListener("mouseleave", () => {
        tooltipObj.style.display = "none";
    });
}