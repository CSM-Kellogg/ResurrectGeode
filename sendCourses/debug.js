


async function debugPlanAhead() {

    // Check if the user needs to sign in
    try {await waitFor(() => {
        return !(location.pathname.includes("ethosidentity")); // Best way I know
    }, 250, 1000);}
    catch (e) {
        console.log("Something broke idk");
        console.log(e);
    }


    let grabElem = document.querySelector('#planningLink');

    await waitFor(() => {
        return (grabElem != null);
    });
    
    if (grabElem) {
        console.log("element found");
        
        grabElem.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    } else {
        console.log("Element not found very sad");
    }
}

debugPlanAhead()