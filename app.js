const bodyElement = document.getElementById('body');
const imageInput = document.getElementById('imageInput');

bodyElement.addEventListener('dragover', (e) => {
    e.preventDefault();  // This is necessary to allow drop.
});

bodyElement.addEventListener('drop', (e) => {
    e.preventDefault(); // Prevent default behavior (like file being opened by the browser)

    if (e.dataTransfer.items) {
        // Check if the dropped items are files
        if (e.dataTransfer.items[0].kind === 'file') {
            const file = e.dataTransfer.items[0].getAsFile();
            imageInput.files = e.dataTransfer.files;
        }
    }
});

document.getElementById('compareButton').addEventListener('click', function() {
    // Get uploaded image filenames
    const images = document.getElementById('imageInput').files;
    const imageNames = Array.from(images).map(img => img.name);

    // Get HTML from textarea
    const htmlContent = document.getElementById('htmlTextarea').value;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Extract image src values
    const imgTags = doc.querySelectorAll('img');
    const srcValues = Array.from(imgTags).map(img => img.getAttribute('src'));
    
    // Check if user has provided required data
    if(images.length === 0) {
        document.getElementById('imageError').style.display = 'block';
        return;  // Stop the function execution here
    } else {
        document.getElementById('imageError').style.display = 'none';
    }

    if(htmlContent.trim() === '') {
        document.getElementById('htmlError').style.display = 'block';
        return;  // Stop the function execution here
    } else {
        document.getElementById('htmlError').style.display = 'none';
    }

    // Check for missing images
    const missingImages = imageNames.filter(name => {
        // Check if any src value contains the image nameapp.js
        return !srcValues.some(src => src.includes(name));
    });

    // Display missing images
    const missingImagesList = document.getElementById('missingImagesList');
    missingImagesList.innerHTML = ''; // Clear previous results

    missingImages.forEach(img => {
        const listItem = document.createElement('li');
        listItem.textContent = img;
        missingImagesList.appendChild(listItem);
    });

    if (missingImages.length > 0) {
        document.querySelector('.missing-images').style.display = 'block'; // Show the section
    } else {
        document.querySelector('.missing-images').style.display = 'none'; // Hide if no missing images
        document.querySelector('.success-message').style.display = 'block'; // Show if successfully using all images
    }
});

window.onload = function() {
    document.getElementById('imageInput').value = ''; // Reset file input
    document.getElementById('htmlTextarea').value = ''; // Reset textarea
}
