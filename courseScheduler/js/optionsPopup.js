// This will probably exist
class Popup {
    constructor() {
        
    }
}

export function displayOptionsPopup(parent) {
    parent.addEventListener('click', (event) => {
        let optionsPopup = document.querySelector('options-popup');

        if (!optionsPopup) {
            optionsPopup = document.createElement('options-popup');
            optionsPopup.id = 'options-popup';
            optionsPopup.className = 'floating-box resize-drag';
        } else {
            optionsPopup.style.display = 'block';
            optionsPopup.innerHTML = '';
        }

        optionsPopup.innerHTML = 'Foo Bar test';
        optionsPopup.style.left = '500px';
        optionsPopup.style.top = '500px';

        document.querySelector('body').appendChild(optionsPopup);
        console.log('hi');
        console.log(parent.innerHTML);
    });
}