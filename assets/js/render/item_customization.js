function recolorSVG(svgDir, colors) {
    return new Promise((resolve, reject) => {
        const tempObj = document.createElement('object');

        tempObj.onload = () => {
            const svgDocument = tempObj?.getSVGDocument();

            if(svgDocument && typeof colors == 'object' && colors.length > 0) {
                colors.forEach((color, index) => {
                    const colorElem = svgDocument.querySelector('#color-' + index);

                    if(!colorElem) return;

                    [...colorElem.childNodes].forEach(path => {
                        if(!path?.style) return;

                        path.style.fill = color;
                    });
                });
            } else {
                reject(new Error('Invalid SVG or colors object'));
                return;
            }

            // Using blob instead of data URI to avoid cross origin errors
            const blob = new Blob([new XMLSerializer().serializeToString(svgDocument)], {type: 'image/svg+xml'});

            resolve(URL.createObjectURL(blob));

            blackHoleElem.removeChild(tempObj);
        }

        tempObj.onerror = () => {
            reject(new Error('Failed to load the SVG!'));
        }

        tempObj.data = svgDir;
        blackHoleElem.appendChild(tempObj);
    });
}

function getSVGColors(svgDir) {
    let res = [];
    
    return new Promise((resolve, reject) => {
        const tempObj = document.createElement('object');

        tempObj.onload = () => {
            const svgDocument = tempObj?.getSVGDocument();

            if(svgDocument) {
                const colorElems = svgDocument.querySelectorAll('[id^="color-"]');

                if(!colorElems) reject(new Error('No colors found!'));

                [...colorElems].forEach(path => {
                    let fillColor = path?.querySelector('path')?.style?.fill;

                    if(!fillColor) return;

                    const rgb = fillColor.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);

                    if(rgb) {
                        fillColor = (rgb && rgb.length === 4) ? "#" +
                            ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
                            ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
                            ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
                    }

                    res.push(fillColor);
                });

                resolve(res);
            } else {
                reject(new Error('Invalid SVG or colors object'));
                return;
            }
        }

        tempObj.onerror = () => {
            reject(new Error('Failed to load the SVG!'));
        }

        tempObj.data = svgDir;
        blackHoleElem.appendChild(tempObj);
    });
}

function fillSVGWithTexture(svgDir, textureDir) {
    return new Promise((resolve, reject) => {
        const tempObj = document.createElement('object');

        tempObj.onload = () => {
            const svgDocument = tempObj?.getSVGDocument();
            
            const defs = svgDocument.querySelector('defs');
            const textures = svgDocument.querySelector('#textures');
            
            function getFinishedSVG(base64img, textureWidth, textureHeight) {
                const encodedImage = base64img;
                const width = textureWidth;
                const height = textureHeight;

                const pattern = document.createElementNS(w3_svg, "pattern");
                    pattern.setAttribute('id', 'imgP');
                    pattern.setAttribute('x', 0);
                    pattern.setAttribute('y', 0);
                    pattern.setAttribute('width', 1);
                    pattern.setAttribute('height', 1);
                    pattern.setAttribute('viewBox', `0 0 ${width} ${height}`);
                    pattern.setAttribute('preserveAspectRatio', "xMidYMid slice");
            
                const image = document.createElementNS(w3_svg, "image");
                    image.setAttribute('width', width);
                    image.setAttribute('height', height);
                    image.setAttributeNS(w3_link, "href", encodedImage);
                
                pattern.appendChild(image);
                defs.appendChild(pattern);
    
                [...textures.childNodes].forEach(path => {
                    path.style['fill-opacity'] = '100';
                    path.style.fill = 'url(#imgP)';
                });
    
                // Using blob instead of data URI to avoid cross origin errors
                const blob = new Blob([new XMLSerializer().serializeToString(svgDocument)], {type: 'image/svg+xml'});
                
                return URL.createObjectURL(blob);
            }
    
            fetch(textureDir)
                .then(res => res.blob())
                .then(blob => {
                    let imgAsBase64 = null;
                    const img = new Image();

                    const reader = new FileReader();

                    reader.onloadend = () => {
                        imgAsBase64 = reader.result;
                        img.src = imgAsBase64;
                    }

                    reader.readAsDataURL(blob);

                    img.onload = () => {
                        resolve(getFinishedSVG(imgAsBase64, img.width, img.height));
                        
                        blackHoleElem.removeChild(tempObj);
                    }
                });
        }

        tempObj.onerror = () => {
            reject(new Error('Failed to load the SVG!'));
        }
    
        tempObj.data = svgDir;
        blackHoleElem.appendChild(tempObj);
    });
}