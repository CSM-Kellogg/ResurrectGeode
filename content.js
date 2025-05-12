console.log("Content script loaded!");

// Define a regex pattern to match common text fields
const fieldPattern = /(search|query|name|subject|course|title|keyword|input|text)/i;

// Get all input fields on the page
const inputFields = document.querySelectorAll("input[type='text'], input:not([type])");

// Loop through inputs and check if they match the pattern
inputFields.forEach((input) => {
    const attributes = [input.name, input.id, input.placeholder].join(" ").toLowerCase();
    
    if (fieldPattern.test(attributes)) {
        input.value = "Computer Science";  // Autofill the field
        console.log("Filled:", input);
    }
});
