fastClick(clearBtn, e => {
    [...document.querySelectorAll('.selected-item')].forEach(item => {
        item.classList.remove('selected-item');
    });

    activeFellaContents = Object.assign([], defaultFellaContents);

    renderFella();
});

itemCarousel.addEventListener('wheel', e => {
    if (e.deltaY > 0) 
        itemCarousel.scrollLeft += 25;
    else 
        itemCarousel.scrollLeft -= 25;
});

fastClick(doneBtn, () => {
    const a = document.createElement('a');
    a.download = `my_fella.png`;
    a.href = canvas.toDataURL();
    a.click();
});

fastClick(settingsBtn, () => {
    settingsContainer.classList.remove('hidden');
});

fastClick(settingsExitBtn, () => {
    settingsContainer.classList.add('hidden');
});

imageQualitySlider.onchange = e => {
    const path = e.path || (e.composedPath && e.composedPath());
    const label = path[1].querySelector('label');
    
    if (label) {
        label.innerText = `Image Resolution (${e.target.value}x${e.target.value})`;
        titleResolutionText.innerText = `(${e.target.value}x${e.target.value})`;

        setCanvasResolution(e.target.value);
    }
};

devmodeCheckbox.onchange = (e) => {
    if(e.target.checked) {
        console.log('Enabled devmode!');
        devmodeEnabled = true;
        devmodeLoop();
    } else {
        console.log('Disabled devmode!');
        devmodeEnabled = false;
    }
}

function monitorCanvasSize() {
    const obsv = new MutationObserver(fitCanvas);

    obsv.observe(fellaContainer, {
        childList: true,
        subtree: true
    });

    window.onresize = fitCanvas;

    fitCanvas();
}

function activateDraggablePanel() {
    let dragActive = false;
    let correction = null;
    let lastPosY = null;
    
    const middleY = editorContainer.clientWidth * (100 / editorContainer.clientHeight);
    const positionY = y => y / editorContainer.clientHeight * 100 - (correction != null ? correction : 0);

    function onMove(e) {
        if(e?.touches) {
            e['clientX'] = e.touches[0].clientX;
            e['clientY'] = e.touches[0].clientY;
        }

        const posY = positionY(e.clientY);

        if (dragActive && posY > 10 && posY < middleY) {
            lastPosY = posY;
            fellaContainer.style.height = posY + 'vh';
        }
    }

    function onDown(e) {
        e.preventDefault();

        const path = e.path || (e.composedPath && e.composedPath());
        if(!path.includes(dragElement)) return;

        dragActive = true;

        if(e?.touches) {
            e['clientX'] = e.touches[0].clientX;
            e['clientY'] = e.touches[0].clientY;
        }

        const posY = positionY(e.clientY);

        correction = posY - (lastPosY != null ? lastPosY : middleY);
    }

    function onUp(e) {
        dragActive = false;
        correction = null;
    }

    if ('ontouchstart' in window) {
        // Mobile
        document.addEventListener("touchstart", onDown);
        document.addEventListener("touchend", onUp);
        document.addEventListener("touchmove", onMove);
    } else {
        // Desktop
        dragPanel.addEventListener("mousedown", onDown);
        document.addEventListener("mouseup", onUp);
        document.addEventListener("mousemove", onMove);
    }
}

async function openChangeColorPanel(item, noSettings) {
    const colorChangePanel = document.createElement('div');
    colorChangePanel.className = 'item-color-panel';

    const colorChangeSettings = document.createElement('div');
    colorChangeSettings.classList.add('item-color-settings');
    colorChangeSettings.classList.add('sleek-round-borders');
    colorChangeSettings.innerHTML = `
        <div class="item-settings-top-panel sleek-round-borders color-settings-top-panel">
            <div class="title-text">Item Settings</div>
        </div>
        <div id="setting-panels"></div>
        <div class="item-settings-control-panel sleek-round-borders color-settings-bottom-panel">
            <div id="color-settings-exit-button" class="round-button color-settings-done-button"></div>
        </div>
    `;

    const settingPanelsElem = colorChangeSettings.querySelector('#setting-panels');

    if(noSettings) {
        settingPanelsElem.innerHTML = `<div class="no-settings-text">No settings</div>`;
    } else {
        if(item?.coloring == true) {
            if(!item?.colors) {
                item.colors = await getItemColors(item);
            }

            item.colors.forEach((color, index) => {
                const i = index + 1;

                const setting = document.createElement('div');
                setting.classList.add('setting');
                setting.classList.add('color-setting');
                setting.innerHTML = `
                    <p for="color-setting-${i}">Color #${i}</p>
                    <input type="color" id="color-setting-${i}" value="${color}" class="color-input"> 
                `;

                setting.onchange = e => {
                    item.colors[index] = e.target.value;
                    renderFella();
                };
    
                settingPanelsElem.appendChild(setting);
            });
        }
    }

    fastClick(colorChangeSettings.querySelector('#color-settings-exit-button'), e => {
        colorChangePanel.remove();
        editorContainer.classList.remove('blurred');
    });

    colorChangePanel.appendChild(colorChangeSettings);
    app.appendChild(colorChangePanel);

    editorContainer.classList.add('blurred');
}