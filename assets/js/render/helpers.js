function fitCanvas() {
    const containerWidth = fellaContainer.clientWidth;
    const zoomAmount = containerWidth / canvasResolution;

    canvas.style.zoom = zoomAmount;
}

function setCanvasResolution(x) {
    canvas.width = x;
    canvas.height = x;

    canvasResolution = x;

    fitCanvas();
    renderFella();
}

function drawRotatedImg(ctx, img, x, y, width, height, degrees) {
    ctx.save();

    ctx.translate(x + width / 2, y + height / 2);
    ctx.rotate(degrees * Math.PI / 180);

    ctx.drawImage(img, -width / 2, -height / 2, width, height);

    ctx.restore();
}

function clearCanvas(ctx) {
    ctx.clearRect(0, 0, canvasResolution, canvasResolution);
}

function clearReferences(obj) {
    // Tried using Object.assign, and ES6 { ...obj } but both didn't work for some reason...
    // This is probably not the fastest method, however at least it works!
    return JSON.parse(JSON.stringify(obj));
}

function objMatch(obj1, obj2) {
    return JSON.stringify(obj1) == JSON.stringify(obj2); 
}