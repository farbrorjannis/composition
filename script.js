let cropper;
const imageInput = document.getElementById('imageInput');
const image = document.getElementById('imageToEdit');
const aspectRatioSelect = document.getElementById('aspectRatio');
const downloadBtn = document.getElementById('downloadBtn');

// 1. Hantera bilduppladdning
imageInput.addEventListener('change', function (e) {
    const files = e.target.files;
    if (files && files.length > 0) {
        const file = files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            // Visa bilden och förstör gammal cropper om den finns
            image.src = event.target.result;
            image.style.display = 'block';
            
            if (cropper) {
                cropper.destroy();
            }

            // Starta Cropper.js
            cropper = new Cropper(image, {
                viewMode: 1, // Håller sig inom bildens gränser
                dragMode: 'move',
                autoCropArea: 0.8,
                restore: false,
                guides: true, // Tredjedelsregeln (Rules of Thirds)
                center: true,
                highlight: false,
                cropBoxMovable: true,
                cropBoxResizable: true,
                toggleDragModeOnDblclick: false,
                ready() {
                    console.log("Cropper is ready!");
                }
            });
        };
        reader.readAsDataURL(file);
    }
});

// 2. Ändra Proportioner (Aspect Ratio)
aspectRatioSelect.addEventListener('change', (e) => {
    if (!cropper) return;
    const value = e.target.value;
    if (value === "NaN") {
        cropper.setAspectRatio(NaN); // Fri beskärning
    } else {
        cropper.setAspectRatio(parseFloat(value));
    }
});

// 3. Gråskala (Value Study)
document.getElementById('btnGrayscale').addEventListener('click', function() {
    if (!cropper) return;
    this.classList.toggle('active');
    // Vi lägger filtret på själva containern som cropper skapar
    const cropperContainer = document.querySelector('.cropper-container');
    cropperContainer.style.filter = this.classList.contains('active') ? 'grayscale(100%)' : 'none';
});

// 4. Spegelvända (Mirror)
document.getElementById('btnMirror').addEventListener('click', function() {
    if (!cropper) return;
    const data = cropper.getData();
    cropper.scaleX(data.scaleX === 1 ? -1 : 1);
});

// 5. Förenkla (Posterize/Simplify) - Enkel visuell simulering
document.getElementById('btnSimplify').addEventListener('click', function() {
    if (!cropper) return;
    this.classList.toggle('active');
    const cropperContainer = document.querySelector('.cropper-container');
    // Vi använder CSS-trick för att simulera posterisering (kontrast + blur + mindre färger)
    if (this.classList.contains('active')) {
        cropperContainer.style.filter += ' contrast(200%) brightness(110%) saturate(150%)';
    } else {
        cropperContainer.style.filter = 'none';
        // Om gråskala var på, sätt tillbaks den
        if (document.getElementById('btnGrayscale').classList.contains('active')) {
            cropperContainer.style.filter = 'grayscale(100%)';
        }
    }
});

// 6. Ladda ner den beskurna bilden
downloadBtn.addEventListener('click', () => {
    if (!cropper) {
        alert("Please upload an image first!");
        return;
    }
    
    // Skapa en canvas av det beskurna området
    const canvas = cropper.getCroppedCanvas({
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
    });

    // Ladda ner som PNG
    const link = document.createElement('a');
    link.download = 'my-art-composition.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});
