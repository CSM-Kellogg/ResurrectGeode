// Drag handles By ChatGPT
// For the dragging between rows
const topPane = document.getElementById('left-top');
const dragHandle = document.getElementById('drag-handle');
const container = document.querySelector('.left-pane');

let isDragging = false;

dragHandle.addEventListener('mousedown', function (e) {
    isDragging = true;
    document.body.style.cursor = 'row-resize';
    e.preventDefault();
});

document.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    
    const containerRect = container.getBoundingClientRect();
    const offsetY = e.clientY - containerRect.top;
    const minHeight = 100;
    const maxHeight = containerRect.height - minHeight;
    
    // Clamp value
    const newHeight = Math.max(minHeight, Math.min(offsetY, maxHeight));
    topPane.style.height = `${newHeight}px`;
});

document.addEventListener('mouseup', function () {
    if (isDragging) {
        isDragging = false;
        document.body.style.cursor = '';
    }
});

// For the dragging between columns
const leftCol = document.getElementById('left-column');
const verticalDrag = document.getElementById('vertical-drag');
const mainContainer = document.getElementById('main-container');

let isDraggingVert = false;

verticalDrag.addEventListener('mousedown', function (e) {
    isDraggingVert = true;
    document.body.style.cursor = 'col-resize';
    e.preventDefault();
});

document.addEventListener('mousemove', function (e) {
    if (!isDraggingVert) return;
    
    const containerRect = mainContainer.getBoundingClientRect();
    const offsetX = e.clientX - containerRect.left;
    const minWidth = 200;
    const maxWidth = containerRect.width - minWidth;
    
    const newWidth = Math.max(minWidth, Math.min(offsetX, maxWidth));
    leftCol.style.width = `${newWidth}px`;
});

document.addEventListener('mouseup', function () {
    if (isDraggingVert) {
        isDraggingVert = false;
        document.body.style.cursor = '';
    }
});