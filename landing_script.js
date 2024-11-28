(() => {
    const mainImageWrapper = document.querySelector('.main-image-wrapper');
    const modal = document.getElementById('imageModal');
    const modalMainImage = document.getElementById('modalMainImage');
    const modalGallery = document.getElementById('modalGallery');
    const totalImage = document.getElementById('totalImage');
    const totalCountImage = document.getElementById('totalCountImage');
    const closeModalContainer = document.getElementById('closeModalContainer');
    const modalGalleryContainer = document.querySelector('.modal-gallery-container');
    const sideThumbnails = document.getElementById('sideThumbnails');

    let currentImageIndex = 0;
    let isGalleryVisible = true;
    let images = [];

    // Fetching image data from the JSON file
    fetch('landing_data.json')
        .then(response => response.json())
        .then(data => {
            images = data.landing_images;
            initializeGallery();
        })
        .catch(error => console.error('Error loading image data:', error));

    // Initialize the gallery
    function initializeGallery() {
        images.forEach((image, index) => {
            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.caption || `Image ${index + 1}`;
            img.onclick = (event) => {
                event.stopPropagation();
                event.preventDefault();
                displayImage(index); // Update the main image without opening the modal
            };
            img.classList.add('thumbnail');
            sideThumbnails.appendChild(img);
        });

        displayImage(0); // Set the first image as the main image
    }

    // Display main image and highlight the current thumbnail
    function displayImage(index) {
        currentImageIndex = index;
        const mainImage = document.getElementById('mainImage');
        if (mainImage) {
            mainImage.src = images[index].src;  // Update main image source
        }
        document.getElementById('caption').textContent = images[index].caption || `Image ${index + 1}`;

        // Update thumbnails
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach(thumb => thumb.classList.remove('selected'));
        thumbnails[index].classList.add('selected');

        updateSideThumbnailsPosition();
        totalImage.textContent = `${index + 1}/${images.length}`;
        totalCountImage.textContent = `${index + 1}/${images.length}`;
    }

    // Smoothly scrolls the thumbnail container to keep the selected thumbnail visible
    function updateSideThumbnailsPosition() {
        const thumbnail = sideThumbnails.children[currentImageIndex];
        const containerHeight = sideThumbnails.clientHeight;
        const thumbnailTop = thumbnail.offsetTop;
        const thumbnailHeight = thumbnail.clientHeight;
        const scrollPosition = thumbnailTop - (containerHeight / 2 - thumbnailHeight / 2);

        sideThumbnails.scrollTo({
            top: scrollPosition,
            behavior: 'smooth'
        });
    }

    // Navigate to previous/next image
    window.changeImage = function (step, event) {
        if (event) {
            event.stopPropagation();
        }
        currentImageIndex = (currentImageIndex + step + images.length) % images.length;
        displayImage(currentImageIndex);
    };

    // Open modal on clicking main image
    mainImageWrapper.addEventListener('click', () => openModal(currentImageIndex));

    // Open modal with a specific image
    window.openModal = function (index) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        updateModalImage(index);

        modalGalleryContainer.style.display = 'block';
        closeModalContainer.classList.remove('rotated');
        isGalleryVisible = true;

        if (!modalGallery.children.length) {
            images.forEach((image, idx) => {
                const thumb = document.createElement('img');
                thumb.src = image.src;
                thumb.alt = image.caption || `Image ${idx + 1}`;
                thumb.classList.add('modal-thumbnail');
                thumb.onclick = () => updateModalImage(idx);
                modalGallery.appendChild(thumb);
            });
        }
    };

    // Close modal
    window.closeModal = function () {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    // Update modal image and size
    function updateModalImageSize() {
        modalMainImage.style.width = isGalleryVisible ? '750px' : '900px';
        modalMainImage.style.height = isGalleryVisible ? '450px' : 'auto';
    }

    // Update modal image
    function updateModalImage(index) {
        currentImageIndex = index;
        modalMainImage.src = images[index].src;
        updateModalImageSize();

        const modalThumbnails = document.querySelectorAll('.modal-thumbnail');
        modalThumbnails.forEach((thumb, idx) => {
            thumb.classList.toggle('active', idx === index);
        });

        scrollModalGalleryToActive();
        totalCountImage.textContent = `${index + 1}/${images.length}`;
    }

    // Change modal image by clicking next/previous
    window.modalChangeImage = function (step) {
        const newIndex = (currentImageIndex + step + images.length) % images.length;
        updateModalImage(newIndex);
    };

    // Scroll the modal gallery
    function scrollModalGalleryToActive() {
        const activeThumb = modalGallery.querySelector('.modal-thumbnail.active');
        if (activeThumb) {
            const galleryRect = modalGallery.getBoundingClientRect();
            const thumbRect = activeThumb.getBoundingClientRect();
            const scrollLeft = thumbRect.left - galleryRect.left + modalGallery.scrollLeft - (galleryRect.width - thumbRect.width) / 2;
            modalGallery.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    }

    // Scroll modal gallery left or right
    window.scrollModalGallery = function (direction) {
        const scrollAmount = direction * modalGallery.offsetWidth * 0.8;
        modalGallery.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    };

    // Close gallery modal view and toggle back to image view
    window.closeGridView = function () {
        if (isGalleryVisible) {
            modalGalleryContainer.style.display = 'none';
            closeModalContainer.classList.add('rotated');
            isGalleryVisible = false;
            updateModalImage(currentImageIndex);
        } else {
            modalGalleryContainer.style.display = 'block';
            closeModalContainer.classList.remove('rotated');
            isGalleryVisible = true;
            updateModalImage(currentImageIndex); 
        }
    };
})();
