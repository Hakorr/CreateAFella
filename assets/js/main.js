function addItemToFella(item) {
    activeFellaContents.push(item);
    renderFella();
}

function removeItemFromFella(item) {
    activeFellaContents = activeFellaContents.filter(x => x != item);
    renderFella();
}

async function getItemColors(item) {
    const fullContentPath = contentPath + item.categoryPath + item.filename;

    const colors = await getSVGColors(fullContentPath);

    return colors;
}

async function fetchTypes() {
    const types = await (await fetch(contentPath + 'types.json')).json();

    return types;
}

async function loadTypes() {
    if(typesObj == null) {
        typesObj = await fetchTypes();
    }

    if (!typesObj) {
        console.warn("Failed to load types. Can't load the application!");
        return;
    }

    clearContainers();
    
    // parse category and items from the json file
    typesObj.forEach((item, idx) => addCategory(item, idx));

    renderFella();
}

async function devmodeLoop() {
    let lastTypes = null;

    async function check() {
        const types = await fetchTypes();

        if(lastTypes == null) {
            lastTypes = types;
        }

        if(JSON.stringify(types) != JSON.stringify(lastTypes)) {
            console.warn('Found changes on types.json file, updating values!');
            loadTypes();
        }

        lastTypes = types;

        if (devmodeEnabled) {
            setTimeout(check, 1000);
        }
    }

    check();
}

async function initialize() {
    editorContainer.classList.remove('hidden');
    
    monitorCanvasSize(); // resize canvas accordingly to fit the container
    activateDraggablePanel();

    loadTypes();
}