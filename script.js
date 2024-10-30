// Funzione per caricare un file di testo e inserirlo in una sezione specifica
function loadTextFile(filePath, elementId) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = `<pre>${data}</pre>`;
        })
        .catch(error => console.error('Errore nel caricamento del file di testo:', error));
}

// Carica i file di testo nelle rispettive sezioni
loadTextFile('cinema.txt', 'cinema-content');           // Cinema
loadTextFile('farma.txt', 'farmacie-content');          // Farmacie
loadTextFile('supermercati.txt', 'supermercati-content');// Supermercati

// Funzione per caricare immagini da una cartella
function loadImages(folderPath, imageCount, elementId) {
    const imageContainer = document.getElementById(elementId);
    for (let i = 1; i <= imageCount; i++) {
        const imgElement = document.createElement('img');
        imgElement.src = `${folderPath}/page_${i}.png`;
        imgElement.alt = `Immagine ${i}`;
        imgElement.style.width = '100%'; // Adatta la larghezza delle immagini alla pagina
        imageContainer.appendChild(imgElement);
    }
}

// Carica le immagini per la sezione Orari Feriali Scuole Chiuse
loadImages('jesi_ferialescuolechiuse_30082024', 13, 'feriali-scuole-chiuse-images');

// Carica le immagini per la sezione Orari Feriali Scolastici
loadImages('jesi_ferialescolastico_06092024', 15, 'feriali-scolastici-images');

// Carica le immagini per la sezione Orari Festivi
loadImages('jesi_festivo_30082024', 4, 'festivi-images');

// Carica l'immagine per la sezione Treni
document.getElementById('treni-image1').src = 'screen_treni/ancona-torrette_full_screenshot.png';
document.getElementById('treni-image2').src = 'screen_treni/ancona_full_screenshot.png';