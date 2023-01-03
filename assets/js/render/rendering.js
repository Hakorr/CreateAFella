async function customizeItems(sortedFellaContents) {
    const coloredContents = activeFellaContents.filter(x => x?.colors?.length > 0);

    if (coloredContents.length > 0) {
        console.log('%c' + `Re-coloring ${coloredContents.length} colored item(s)`, 'color: LightBlue; font-size: 1.5vh;');

        for (const [i, content] of coloredContents.entries()) {
            const subdir = content?.categoryPath || 'default/';

            const svg = content?.customizedSrc || contentPath + subdir + content.filename;
            const colors = content?.colors;

            if(colors) {
                const res = await recolorSVG(svg, colors);
                content['customizedSrc'] = res;

                console.log(
                    '%c' + `(${(i + 1)}/${coloredContents.length}) CUSTOMIZED CONTENT`
                    + `\nModified content: ${svg}`
                    + `\nApplied content: ${colors}`, 'color: #717171'
                );
            }
        }
    }

    const textureContents = activeFellaContents.filter(x => x.texture == true);
    
    if (textureContents.length > 0) {
        console.log('%c' + `Applying texture to ${textureContents.length} item(s)`, 'color: LightBlue; font-size: 1.5vh;');

        for (const [i, content] of textureContents.entries()) {
            const fullContentPath = contentPath + content.categoryPath + content.filename;

            const modifiedCategoryName = x => x.toLowerCase().replaceAll(' ', '_');

            const contentCategoryName = modifiedCategoryName(content.categoryName);
            const outlineSvgContent = sortedFellaContents.find(c => c.filename.replace('.svg', '') == contentCategoryName);

            const svg = defaultContentPath + outlineSvgContent.filename;
            const texture = content?.customizedSrc || fullContentPath;

            const res = await fillSVGWithTexture(svg, texture);
            outlineSvgContent['customizedSrc'] = res;

            console.log(
                '%c' + `(${(i + 1)}/${textureContents.length}) CUSTOMIZED CONTENT`
                + `\nModified content: ${svg}`
                + `\nApplied content: ${texture}`, 'color: #717171'
            );
        }
    }
}

async function renderFella() {
    console.log('%c' + `Starting the Fella render!`, 'color: DodgerBlue; font-size: 2vh;');
    const startTime = new Date();

    const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvasResolution;
        tempCanvas.height = canvasResolution;

    const tempContext = tempCanvas.getContext('2d');

    const sortedFellaContents = activeFellaContents.sort((a, b) => a.z_index - b.z_index)
        .filter(x => x.texture == false || !x.texture);

    // remove earlier modified versions of content (applied textures, colors & such)
    sortedFellaContents.forEach(x => delete x?.customizedSrc);

    await customizeItems(sortedFellaContents);

    // Loop through the active items and draw them to the temp context
    if (sortedFellaContents.length > 0) {
        console.log('%c' + `Drawing ${sortedFellaContents.length} item(s)`, 'color: LightBlue; font-size: 1.5vh;');

        for (const [i, content] of sortedFellaContents.entries()) {
            const subdir = content?.categoryPath || 'default/';
            const fullContentPath = contentPath + subdir + content.filename;

            const img = new Image();
            const r = (canvasResolution / defaultResolution);

            const width = content?.width * r || canvasResolution;
            const height = content?.height * r || canvasResolution;
            const rotation = content?.rotation || 0;

            const pos = {
                x: canvasPos.center(width) + (content.correction?.x * r || 0),
                y: canvasPos.center(height) - (content.correction?.y * r || 0)
            };

            const imageLoaded = () => new Promise((res, rej) => {
                img.onload = () => {
                    drawRotatedImg(
                        tempContext, img,
                        pos.x, pos.y,
                        width, height,
                        rotation
                    );

                    console.log(
                        '%c' + `(${(i + 1)}/${sortedFellaContents.length}) DREW CONTENT`, 'color: #a8a8a8',
                        '\nContent:', clearReferences(content)
                    );

                    res(true);
                };

                img.onerror = () => {
                    rej(new Error('Failed to load image!'));
                };
            });

            img.src = content?.customizedSrc || fullContentPath;

            await imageLoaded();
        }
    }

    // Update the item element's image to the customized one, if it exists
    if(activeFellaContents.length > 0) {
        activeFellaContents.forEach(item => {
            if(item?.imgElem && item?.customizedSrc) {
                item.imgElem.style['background-image'] = `url("${item.customizedSrc}")`;
            }
        });
    }

    // Finish render (Draw temp canvas to main context)
    clearCanvas(mainContext);
    mainContext.drawImage(tempCanvas, 0, 0);

    console.log(`%cRender complete!`, 'color: lightgreen', '(Elapsed', (new Date() - startTime), 'ms)');
}