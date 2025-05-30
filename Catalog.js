/**
* Boiler plate for singleton by ChatGPT
* 
*/

class Catalog {
    
    #catalogFile = "catalog.csv"
    
    constructor() {
        if (Catalog._instance) {
            return Catalog._instance;
        }
        Catalog._instance = this;
        
        this.#loadCatalog();
    }
    
    #loadCatalog() {
        // Chat-GPT: Load a file and read it
        fetch(chrome.runtime.getURL(this.#catalogFile))
            .then(res => res.text())
            .then(text => console.log(text))
            .catch(console.error);
    }

    foo() {
        console.log("foo");
    }
}

const CatalogInstance = new Catalog();
Object.freeze(CatalogInstance);

export default CatalogInstance;