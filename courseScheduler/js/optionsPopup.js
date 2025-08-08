// This will probably exist
// class Popup {
//     constructor() {
        
//     }
// }

export function displayOptionsPopup(parent, sectionOptions, currentChoices) {
    parent.addEventListener('click', (event) => {
        let optionsPopup = document.querySelector('#options-popup');

        // Make sure that two copies cant be loaded in at the same time
        if (optionsPopup) {
            optionsPopup.innerHTML = '';
        } else {
            optionsPopup = document.createElement('div');
            optionsPopup.id = 'options-popup';
            optionsPopup.className = 'floating-box resize-drag';
        }

        // Set the style correctly
        optionsPopup.style.left = '20%';
        optionsPopup.style.top = '20%';

        // Close button and header using a template in scheduler.html
        const template = document.getElementById("course-header-template");
        const header = template.content.cloneNode(true);

        // Modify the header and append to popup
        header.querySelector('#add-course-btn').remove();
        header.querySelector('.fw-bold').innerHTML = "Course Options Select";
        
        header.querySelector(".close-btn").onclick = () => optionsPopup.remove();

        optionsPopup.append(header);

        // Show the options for this class
        const popupBody = document.createElement('div');
        popupBody.innerHTML = sectionOptions['CRN'].toString();
        optionsPopup.append(popupBody);

        // Append popup to body
        document.querySelector('body').appendChild(optionsPopup);
        
    }, {once: true});

    return currentChoices;
}