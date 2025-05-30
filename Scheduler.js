import catalog from './Catalog.js';

// Track search submission
document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form reload
    const inputValue = document.getElementById('keyword-search').value;
    console.log("Submitted:", inputValue);
    // Your custom logic here
});

catalog.foo(); // outputs: foo function called