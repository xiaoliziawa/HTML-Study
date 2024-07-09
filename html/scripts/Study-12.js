const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const brushSizeDisplay = document.getElementById('brushSizeDisplay');
const brushType = document.getElementById('brushType');
const drawMode = document.getElementById('drawMode');
const gridSizeSelect = document.getElementById('gridSize');
const eraserBtn = document.getElementById('eraserBtn');
const undoBtn = document.getElementById('undoBtn');
const clearBtn = document.getElementById('clearBtn');
const saveBtn = document.getElementById('saveBtn');
const toggleGridBtn = document.getElementById('toggleGridBtn');

let isDrawing = false;
let lastX = 0;
let lastY = 0;
let isEraser = false;
let gridSize = 16;
let pixelSize = canvas.width / gridSize;
let showGrid = true;
let undoStack = [];
let pixels = createEmptyPixelArray();

function createEmptyPixelArray() {
    return new Array(gridSize).fill().map(() => new Array(gridSize).fill(null));
}

function drawGrid() {
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * pixelSize, 0);
        ctx.lineTo(i * pixelSize, canvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * pixelSize);
        ctx.lineTo(canvas.width, i * pixelSize);
        ctx.stroke();
    }
}

function drawPixels() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            if (pixels[y][x]) {
                ctx.fillStyle = pixels[y][x];
                ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
        }
    }
    if (showGrid && drawMode.value === 'pixel') {
        drawGrid();
    }
}

function getPixelCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / pixelSize);
    const y = Math.floor((e.clientY - rect.top) / pixelSize);
    return [x, y];
}

function startPosition(e) {
    isDrawing = true;
    if (drawMode.value === 'free') {
        [lastX, lastY] = [e.offsetX, e.offsetY];
    } else {
        draw(e);
    }
    saveState();
}

function endPosition() {
    isDrawing = false;
}

function draw(e) {
    if (!isDrawing) return;

    if (drawMode.value === 'free') {
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.strokeStyle = isEraser ? '#1E1E1E' : colorPicker.value;
        ctx.lineWidth = brushSize.value;
        ctx.lineCap = brushType.value === 'square' ? 'butt' : 'round';
        ctx.lineJoin = 'round';

        if (brushType.value === 'calligraphy') {
            ctx.lineWidth = brushSize.value * 2;
            ctx.lineCap = 'square';
            ctx.lineJoin = 'miter';
        } else if (brushType.value === 'watercolor') {
            ctx.globalAlpha = 0.3;
        } else {
            ctx.globalAlpha = 1;
        }

        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    } else {
        const [x, y] = getPixelCoordinates(e);
        if (x >= 0 && x < gridSize && y >= 0 && y < gridSize) {
            pixels[y][x] = isEraser ? null : colorPicker.value;
            drawPixels();
        }
    }
}

function saveState() {
    if (drawMode.value === 'free') {
        undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    } else {
        undoStack.push(JSON.parse(JSON.stringify(pixels)));
    }
}

function undo() {
    if (undoStack.length > 1) {
        undoStack.pop();
        if (drawMode.value === 'free') {
            ctx.putImageData(undoStack[undoStack.length - 1], 0, 0);
        } else {
            pixels = JSON.parse(JSON.stringify(undoStack[undoStack.length - 1]));
            drawPixels();
        }
    }
}

function updateBrushSizeDisplay() {
    brushSizeDisplay.style.width = brushSize.value + 'px';
    brushSizeDisplay.style.height = brushSize.value + 'px';
}

function saveArtwork() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    if (drawMode.value === 'free') {
        tempCtx.drawImage(canvas, 0, 0);
    } else {
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                if (pixels[y][x]) {
                    tempCtx.fillStyle = pixels[y][x];
                    tempCtx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
                }
            }
        }
    }

    const link = document.createElement('a');
    link.download = 'artwork.png';
    link.href = tempCanvas.toDataURL();
    link.click();
}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);

eraserBtn.addEventListener('click', () => {
    isEraser = !isEraser;
    eraserBtn.textContent = isEraser ? '切换到画笔' : '橡皮擦';
});

undoBtn.addEventListener('click', undo);

clearBtn.addEventListener('click', () => {
    if (drawMode.value === 'free') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        undoStack = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
    } else {
        pixels = createEmptyPixelArray();
        undoStack = [createEmptyPixelArray()];
        drawPixels();
    }
});

saveBtn.addEventListener('click', saveArtwork);

toggleGridBtn.addEventListener('click', () => {
    showGrid = !showGrid;
    if (drawMode.value === 'pixel') {
        drawPixels();
    }
});

gridSizeSelect.addEventListener('change', (e) => {
    gridSize = parseInt(e.target.value);
    pixelSize = canvas.width / gridSize;
    pixels = createEmptyPixelArray();
    undoStack = [createEmptyPixelArray()];
    if (drawMode.value === 'pixel') {
        drawPixels();
    }
});

drawMode.addEventListener('change', (e) => {
    if (e.target.value === 'free') {
        gridSizeSelect.style.display = 'none';
        toggleGridBtn.style.display = 'none';
        brushSize.style.display = 'inline-block';
        brushType.style.display = 'inline-block';
        brushSizeDisplay.style.display = 'inline-block';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        undoStack = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
    } else {
        gridSizeSelect.style.display = 'inline-block';
        toggleGridBtn.style.display = 'inline-block';
        brushSize.style.display = 'none';
        brushType.style.display = 'none';
        brushSizeDisplay.style.display = 'none';
        pixels = createEmptyPixelArray();
        undoStack = [createEmptyPixelArray()];
        drawPixels();
    }
});

brushSize.addEventListener('input', updateBrushSizeDisplay);

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'z') {
        undo();
    }
});

gridSizeSelect.style.display = 'none';
toggleGridBtn.style.display = 'none';
updateBrushSizeDisplay();
saveState();