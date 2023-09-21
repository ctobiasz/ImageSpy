const bodyElement = document.getElementById('body');
const imageInput = document.getElementById('imageInput');

bodyElement.addEventListener('dragover', (e) => {
    e.preventDefault();  
});

bodyElement.addEventListener('drop', (e) => {
    e.preventDefault();

    if (e.dataTransfer.items && e.dataTransfer.items[0].kind === 'file') {
        imageInput.files = e.dataTransfer.files;
    }
});

document.getElementById('compareButton').addEventListener('click', function() {
    const images = document.getElementById('imageInput').files;
    const imageNames = Array.from(images).map(img => img.name);
    const htmlContent = document.getElementById('htmlTextarea').value;
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    const imgTags = doc.querySelectorAll('img');
    const srcValues = Array.from(imgTags).map(img => img.getAttribute('src'));

    const inlineBackgroundImages = Array.from(doc.querySelectorAll('[style*="background-image"]'))
        .map(elem => elem.style.backgroundImage.slice(5, -2));

    const backgroundAttrImages = Array.from(doc.querySelectorAll('[background]'))
        .map(elem => elem.getAttribute('background'));

    const vmlImages = Array.from(doc.querySelectorAll('v\\:fill, v\\:image'))
        .map(vml => vml.getAttribute('src'))
        .filter(Boolean);

    const styleTags = Array.from(doc.querySelectorAll('style'));
    let styleBackgroundImages = [];
    const regex = /url\(['"]?(.*?)(?=['"]?\))/g;
    styleTags.forEach(style => {
        let match;
        while (match = regex.exec(style.innerHTML)) {
            styleBackgroundImages.push(match[1]);
        }
    });

    const allSrcValues = srcValues.concat(inlineBackgroundImages, backgroundAttrImages, vmlImages, styleBackgroundImages);

    if (!images.length) {
        document.getElementById('imageError').style.display = 'block';
        return; 
    } else {
        document.getElementById('imageError').style.display = 'none';
    }

    if (!htmlContent.trim()) {
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

        listItem.addEventListener('click', function() {
            navigator.clipboard.writeText(img).then(function() {
                console.log('Copying was successful.');
                listItem.style.color = 'rgb(202, 202, 208)'; 
            }, function(err) {
                console.error('Could not copy text: ', err);
            });
        });

        listItem.style.cursor = 'pointer';
        missingImagesList.appendChild(listItem);
    });

    if (missingImages.length > 0) {
        document.querySelector('.missing-images').style.display = 'block'; // Show the section for missing images
        document.querySelector('.success-message').style.display = 'none'; // Hide the success message
    } else {
        document.querySelector('.missing-images').style.display = 'none'; // Hide the section for missing images
        document.querySelector('.success-message').style.display = 'block'; // Show the success message
    }
    
});

window.onload = function() {
    document.getElementById('imageInput').value = '';
    document.getElementById('htmlTextarea').value = '';
}
