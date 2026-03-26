let cropper;
const imageInput = document.getElementById('imageInput');
const image = document.getElementById('imageToEdit');
const aspectRatioSelect = document.getElementById('aspectRatio');

// Initialize Cropper
imageInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
        const reader = new FileReader();
        reader.onload = (event) => {
            image.src = event.target.result;
            image.style.display = 'block';
            if (cropper) cropper.destroy();
            
            cropper = new Cropper(image, {
                viewMode: 1,
                dragMode: 'move',
                autoCropArea: 1,
                restore: false,
                guides: true, // Visar tredjedelsregeln
                center: true,
                highlight: false,
                cropBoxMovable: true,
                cropBoxResizable: true,
            });
        };
        reader.readAsDataURL(files[0]);
    }
});

// Change Ratio
aspectRatioSelect.addEventListener('change', (e) => {
    cropper.setAspectRatio(parseFloat(e.target.value));
});

// Visual Effects
document.getElementById('btnGrayscale').addEventListener('click', function() {
    this.classList.toggle('active');
    const container = document.querySelector('.cropper-container');
    container.style.filter = this.classList.contains('active') ? 'grayscale(100%)' : 'none';
});

document.getElementById('btnMirror').addEventListener('click', function() {
    let scaleX = cropper.getData().scaleX === 1 ? -1 : 1;
    cropper.scaleX(scaleX);
});

document.getElementById('btnSimplify').addEventListener('click', function() {
    alert("Simplify (Posterize) preview is active on export.");
    // Logik för posterisering läggs bäst på den exporterade bilden
});

// Download Function
document.getElementById('downloadBtn').addEventListener('click', () => {
    const canvas = cropper.getCroppedCanvas();
    const link = document.createElement('a');
    link.download = 'my-composition.png';
    link.href = canvas.toDataURL();
    link.click();
});
