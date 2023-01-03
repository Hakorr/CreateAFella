function clearContainers() {
    itemCarousel.innerHTML = '';
    itemContainer.innerHTML = '';
}

function makeItemElem(item, cG) {
    const category = cG.category;
    const categoryPath = cG.path;

    item['categoryName'] = category;
    item['categoryPath'] = categoryPath;

    const noSettings = [item?.coloring]
        .filter(x => !!x).length ? false : true;

    const itemElem = document.createElement('div');
    itemElem.className = 'item';

    if(!noSettings) {
        itemElem.innerHTML = `<div class="icon-container">
            <div class="settings-wheel"></div>
        </div>`;
    }

    const imageElem = document.createElement('span');
    imageElem.className = 'item-icon';
    imageElem.style['background-image'] = `url("${(item?.customizedSrc)
        ? item.customizedSrc 
        : contentPath + categoryPath + item.filename}")`;
    //imageElem.style.width = `${item.width / (item.width + item.height) * 125}%`;
    //imageElem.style.height = `${item.height / (item.width + item.height) * 125}%`;

    imageElem.oncontextmenu = () => false; // disable contextmenu
    itemElem.appendChild(imageElem);

    item['imgElem'] = imageElem;

    fastClick(itemElem, () => {
        const selectedItemClass = 'selected-item';
        
        if (itemElem.classList.contains(selectedItemClass)) {
            itemElem.classList.remove(selectedItemClass);
            removeItemFromFella(item);
        } else {
            itemElem.classList.add(selectedItemClass);
            addItemToFella(item);
        }
    }, () => {
        openChangeColorPanel(item, noSettings);
    });

    return itemElem;
}

function fillCategoryContainerWithItems(cG, categoryContainerElem) {
    const category = cG.category;

    cG.sub.forEach(sub => {
        if (sub.name) {
            const subtitleElem = document.createElement('div');
            subtitleElem.className = 'subgategory-title';
            subtitleElem.innerText = sub.name;

            categoryContainerElem.appendChild(subtitleElem);
        }

        sub.items.forEach(item => categoryContainerElem.appendChild(makeItemElem(item, cG)));

        const rndNumber = Math.floor(Math.random() * 10e10);

        if(["Tops", "Bottoms", "Shoes"].includes(category)) {
            const itemUploadBtn = document.createElement('div');
            itemUploadBtn.className = 'item item-upload-item';
            itemUploadBtn.innerHTML = `
            <label for="item-file-upload-${rndNumber}" class="item-upload-full">
                <span class="item-upload-button item-upload-full"></span>
                <input type="file" id="item-file-upload-${rndNumber}" accept="image/*" style="display:none">
            </div>`;

            itemUploadBtn.onchange = e => {
                if(!e.target?.files?.length) return;

                const file = e.target.files[0];
                const blob = new Blob([file], {type: file.type});

                const item = {
                    "filename": Math.floor(Math.random() * 10e10) + '_' + file.name,
                    "customizedSrc": URL.createObjectURL(blob),
                    "texture": true
                };

                categoryContainerElem.append(makeItemElem(item, cG), itemUploadBtn);
            };

            categoryContainerElem.appendChild(itemUploadBtn);
        }
    });
}

function addCategory(cG, idx) {
    const category = cG.category;

    const id = category.toLowerCase().replaceAll(' ', '-') + '-category';
    const activeCategoryTag = 'active-category';
    const activeCarouselItemTag = 'carousel-item-active';

    const carouselItem = document.createElement('div');
    carouselItem.className = 'carousel-item';
    
    const carouselImage = document.createElement('span');
    carouselImage.className = 'item-icon';
    carouselImage.style['background-image']  = `url("${contentPath + cG.icon}")`;
    carouselItem.appendChild(carouselImage);

    const itemCategoryContainer = document.createElement('div');
    itemCategoryContainer.className = 'item-category-container';
    itemCategoryContainer.id = id;

    function carouselItemClicked(e) {
        e.preventDefault();

        itemCarousel.childNodes.forEach(container => {
            container.classList.remove(activeCarouselItemTag);
        });

        itemContainer.childNodes.forEach(container => {
            container.classList.remove(activeCategoryTag);
        });

        carouselItem.classList.add(activeCarouselItemTag);
        itemCategoryContainer.classList.add(activeCategoryTag);
    }

    fastClick(carouselItem, carouselItemClicked);

    if (idx == 0) {
        carouselItem.classList.add(activeCarouselItemTag);
        itemCategoryContainer.classList.add(activeCategoryTag);
    }

    itemCarousel.appendChild(carouselItem);
    itemContainer.appendChild(itemCategoryContainer);

    fillCategoryContainerWithItems(cG, itemCategoryContainer);
}