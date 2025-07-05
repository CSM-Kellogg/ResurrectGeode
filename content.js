console.log("Content script loaded!");

let weSentUser = null;

// Event listener for currently if we sent the user to the plan ahead page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "WE_SENT_USER") {
        weSentUser = true;
        console.log("Received WeSentUser in content script:", weSentUser);
    }
});

// If the user ends up where they should
if (location.pathname == "/StudentRegistrationSsb/ssb/registration/registration" && weSentUser) {
    console.log('made it!');
    
    // Clear the boolean
    weSentUser = false;
}

// If the user ends up at the sign in
else if (location.pathname.includes('ethosidentity')) {
    console.log('hi');

    console.log(weSentUser);
}