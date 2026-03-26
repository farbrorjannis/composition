document.addEventListener('DOMContentLoaded', function () {
    let cropper;
    const imageInput = document.getElementById('imageInput');
    const image = document.getElementById('imageToEdit');
    const mainLayout = document.getElementById('mainLayout');

    imageInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            image.src = event.target.result;
            mainLayout.style.display = 'flex';

            if (cropper) {
                cropper.destroy();
            }

            // Vänta ett litet ögonblick så att bilden hinner laddas i DOM:en
            setTimeout(() => {
                cropper = new Cropper(image, {
                    viewMode: 1,
                    dragMode: 'move',
                    autoCropArea: 0.9,
                    guides: true,
                    center: true,
                    highlight: false,
                    background: false,
                    ready() {
                        console.log("Cropper is ready!");
                    }
                });
            }, 100);
        };
        reader.readAsDataURL(file);
    });

    // Kontroller
    document.getElementById('aspectRatio').addEventListener('change', (e) => {
        if (cropper) cropper.setAspectRatio(parseFloat(e.target.value));
    });

    document.getElementById('btnGrayscale').addEventListener('click', function() {
        this.classList.toggle('active');
        document.querySelector('.cropper-container').style.filter = 
            this.classList.contains('active') ? 'grayscale(100%)' : 'none';
    });

    document.getElementById('btnMirror').addEventListener('click', () => {
        if (cropper) cropper.scaleX(cropper.getData().scaleX === 1 ? -1 : 1);
    });

    document.getElementById('btnSimplify').addEventListener('click', function() {
        this.classList.toggle('active');
        document.querySelector('.cropper-container').classList.toggle('posterize');
    });

    document.getElementById('downloadBtn').addEventListener('click', () => {
        if (!cropper) return;
        const canvas = cropper.getCroppedCanvas();
        const link = document.createElement('a');
        link.download = 'composition.png';
        link.href = canvas.toDataURL();
        link.click();
    });
});
