const bodyElement = document.getElementById('body');
const imageInput = document.getElementById('imageInput');

bodyElement.addEventListener('dragover', (e) => {
    e.preventDefault();  // This is necessary to allow drop.
});

bodyElement.addEventListener('drop', (e) => {
    e.preventDefault();

    if (e.dataTransfer.items) {
        if (e.dataTransfer.items[0].kind === 'file') {
            const file = e.dataTransfer.items[0].getAsFile();
            imageInput.files = e.dataTransfer.files;
        }
    }
});

document.getElementById('compareButton').addEventListener('click', function() {
    const images = document.getElementById('imageInput').files;
    const imageNames = Array.from(images).map(img => img.name);
    const htmlContent = document.getElementById('htmlTextarea').value;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    // Extract image sources from img tags
    const imgTags = doc.querySelectorAll('img');
    const srcValues = Array.from(imgTags).map(img => img.getAttribute('src'));

    // Extract images from inline background styles
    const inlineBackgroundImages = Array.from(doc.querySelectorAll('[style*="background-image"]'))
        .map(elem => {
            const style = elem.style.backgroundImage;
            return style.slice(5, -2); // Remove url(" and ")
        });

    // Extract images from background attributes
    const backgroundAttrImages = Array.from(doc.querySelectorAll('[background]'))
        .map(elem => elem.getAttribute('background'));

    // Extract images from VML v:fill tags
    const vmlImages = Array.from(doc.querySelectorAll('v\\:fill, v\\:image'))
        .map(vml => vml.getAttribute('src'))
        .filter(Boolean);

    const allSrcValues = srcValues.concat(inlineBackgroundImages, backgroundAttrImages, vmlImages);

    if (images.length === 0) {
        document.getElementById('imageError').style.display = 'block';
        return; 
    } else {
        document.getElementById('imageError').style.display = 'none';
    }

    if (htmlContent.trim() === '') {
        document.getElementById('htmlError').style.display = 'block';
        return;  
    } else {
        document.getElementById('htmlError').style.display = 'none';
    }

    const missingImages = imageNames.filter(name => !allSrcValues.some(src => src.includes(name)));

    const missingImagesList = document.getElementById('missingImagesList');
    missingImagesList.innerHTML = '';

    missingImages.forEach(img => {
        const listItem = document.createElement('li');
        listItem.textContent = img;
        missingImagesList.appendChild(listItem);
    });

    if (missingImages.length > 0) {
        document.querySelector('.missing-images').style.display = 'block';
    } else {
        document.querySelector('.missing-images').style.display = 'none'; 
        document.querySelector('.success-message').style.display = 'block'; 
    }
});

window.onload = function() {
    document.getElementById('imageInput').value = ''; 
    document.getElementById('htmlTextarea').value = ''; 
}
