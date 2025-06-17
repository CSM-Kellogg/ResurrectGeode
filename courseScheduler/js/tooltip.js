//Yknow what, imma cross the bridge when I get there

export function createTooltip(section, Event, cellHeight) {
    const block = document.createElement("div");
    const instructor = section.instructorName || "Unknown";
    const crn = section.CRN || "Unknown";
    const sectionCode = section.sectionCode || "N/A";
    const room = section.room || "TBD";
    
    block.addEventListener("mouseenter", (e) => {
        tooltip.innerHTML = `<strong class="mb-1">${section.parentCourse['class name']}</strong>
        <strong>Section:</strong> ${sectionCode}
        <strong>CRN:</strong> ${crn}
        <strong>Instructor:</strong> ${instructor}
        <strong>Room:</strong> ${room}`;
        tooltip.style.display = "block";
    });
    
    block.addEventListener("mousemove", (e) => {
        const tooltipRect = tooltip.getBoundingClientRect();
        const margin = 10;
        
        let left = Event.clientX + 15;
        let top = Event.clientY + 15;
        
        // If tooltip would go off the right edge
        if (left + tooltipRect.width + margin > window.innerWidth) {
            left = Event.clientX - tooltipRect.width - 15;
        }
        
        // If tooltip would go off the bottom edge
        if (top + tooltipRect.height + margin > window.innerHeight) {
            top = e.clientY - tooltipRect.height - 15;
        }
        
        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
    });
    
    block.addEventListener("mouseleave", () => {
        tooltip.style.display = "none";
    });
    
    block.className = "schedule-block";
    block.style.backgroundColor = color;
    block.style.height = ((end - start) / 15) * cellHeight + "px";
    
    block.textContent = section.parentCourse['class name'];

    return block;
}