const defaultFellaContents = [
    {
        filename: 'face_compressed.png',
        z_index: 0,
        width: 375,
        height: 250,
        rotation: null,
        texture: false,
        correction: {
            x: -10,
            y: 192
        }
    },
    {
        filename: 'tops.svg',
        z_index: 0
    },
    {
        filename: 'bottoms.svg',
        z_index: -1
    },
    {
        filename: 'shoes.svg',
        z_index: -2
    }
];

let activeFellaContents = Object.assign([], defaultFellaContents);

const app = document.querySelector('#app');
const settingsContainer = document.querySelector('#settings-container');
const editorContainer = document.querySelector('#editor-container');
const itemContainer = document.querySelector('#item-container');

const defaultResolution = 1000;
let canvasResolution = 1000;

const canvasPos = {
    'center': size => (canvasResolution - size) / 2
};

const fellaContainer = document.querySelector('#fella-container');
const canvas = document.querySelector('#main-canvas');
    canvas.width = canvasResolution;
    canvas.height = canvasResolution;

const mainContext = canvas.getContext("2d");

const contentPath = 'assets/content/';
const defaultContentPath = contentPath + 'default/';

const doneBtn = document.querySelector('#done-button');
const randomizeBtn = document.querySelector('#randomize-button');
const undoBtn = document.querySelector('#undo-button');
const clearBtn = document.querySelector('#clear-button');
const settingsBtn = document.querySelector('#settings-button');
const settingsExitBtn = document.querySelector('#settings-exit-button');

const imageQualitySlider = document.querySelector('#image-quality-slider');
const titleResolutionText = document.querySelector('#title-resolution-text');

const devmodeCheckbox = document.querySelector('#dev-mode-checkbox');
let devmodeEnabled = false;

const dragPanel = document.querySelector('#drag-panel');
const dragElement = document.querySelector('#drag-element');

const itemCarousel = document.querySelector('#item-carousel');

const blackHoleElem = document.querySelector('#black-hole');

const w3_svg = "http://www.w3.org/2000/svg";
const w3_link = "http://www.w3.org/1999/xlink";

let typesObj = null;