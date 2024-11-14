function loadTextFile(filePath, elementId) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            const paragraphs = data.split('\n').map(line => `<p>${line}</p>`).join('');
            document.getElementById(elementId).innerHTML = paragraphs;
        })
        .catch(error => console.error('Errore nel caricamento del file info.txt', error));
}


//Supermercati

function loadSupermarketFile(filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Errore nel caricamento del file supermercati.txt');
            }
            return response.text();
        })
        .then(data => {
            console.log("Dati ricevuti:", data);  // Verifica i dati ricevuti

            // Seleziona il contenitore del contenuto
            const supermercatiContent = document.getElementById('supermercati-content');
            if (!supermercatiContent) {
                console.error("Elemento con ID 'supermercati-content' non trovato");
                return;
            }
            supermercatiContent.classList.add('scrollable'); // Aggiungi la classe scrollable

            // Filtra le righe per rimuovere introduzioni o intestazioni inutili
            const lines = data.split('\n');
            const filteredLines = lines.filter(line => 
                !line.startsWith("Ecco un elenco") &&
                !line.startsWith("Questi supermercati")
            );

            const cleanedData = filteredLines.join('\n');
            const sections = cleanedData.split(/\d+\.\s\*\*/); // Dividi per "1. **", "2. **", ecc.

            sections.forEach((section) => {
                if (section.trim()) {
                    const cleanedSection = section.replace(/\*\*/g, '').trim();
                    const name = cleanedSection.split("\n")[0];
                    const restOfSection = cleanedSection.slice(name.length).trim();

                    const indirizzoStart = restOfSection.indexOf("Indirizzo:") + "Indirizzo:".length;
                    const telefonoStart = restOfSection.indexOf("Telefono:") + "Telefono:".length;
                    const orariStart = restOfSection.indexOf("Orari:") + "Orari:".length;

                    const indirizzoEnd = restOfSection.indexOf("\n", indirizzoStart);
                    const telefonoEnd = restOfSection.indexOf("\n", telefonoStart);
                    const orariEnd = restOfSection.indexOf("\n", orariStart);

                    const indirizzo = restOfSection.substring(indirizzoStart, indirizzoEnd !== -1 ? indirizzoEnd : undefined).trim();
                    const telefono = restOfSection.substring(telefonoStart, telefonoEnd !== -1 ? telefonoEnd : undefined).trim();
                    const orari = restOfSection.substring(orariStart, orariEnd !== -1 ? orariEnd : undefined).trim();

                    console.log("Nome:", name);
                    console.log("Indirizzo:", indirizzo || 'Non trovato');
                    console.log("Telefono:", telefono || 'Non trovato');
                    console.log("Orari:", orari || 'Non trovato');

                    // Crea e aggiungi l'HTML per ciascun supermercato
                    const formattedSection = `
                        <h3><strong>${name}</strong></h3>
                        <p><strong>Indirizzo:</strong> ${indirizzo || 'Non disponibile'}</p>
                        <p><strong>Telefono:</strong> ${telefono || 'Non disponibile'}</p>
                        <p><strong>Orari:</strong> ${orari || 'Non disponibile'}</p>
                    `;
                    supermercatiContent.innerHTML += `<div class="supermercati-content">${formattedSection}</div>`;
                }
            });
        })
        .catch(error => console.error('Errore nel caricamento del file supermercati.txt:', error));
}


// Funzione per caricare il file delle farmacie
function loadPharmacyFile(filePath) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            const pharmacyContent = document.getElementById('farmacie-content');
            pharmacyContent.classList.add('scrollable');  // Aggiungi la classe scrollable
            const nightShiftContent = document.getElementById('farmacie-turno-notturno');
            nightShiftContent.classList.add('scrollable');  // Aggiungi la classe scrollable
            const sections = data.split('###');
            const relevantSections = sections.slice(1); // Rimuove la prima sezione vuota

            // Variabili per accumulare i contenuti separati
            let pharmaciesHTML = "";
            let nightShiftHTML = "";

            relevantSections.forEach((section) => {
                if (section.trim()) {
                    const lines = section.trim().split('\n');

                    // Gestisce la sezione "Note"
                    if (lines[0].includes("Note")) {
                        let noteHTML = `<div class="note-section"><h3>Note</h3>`;
                        for (let i = 1; i < lines.length; i++) {
                            if (lines[i].trim()) {
                                noteHTML += `<p>${lines[i].trim()}</p>`;
                            }
                        }
                        noteHTML += `</div>`;
                        pharmacyContent.innerHTML += noteHTML;  // Aggiunge le note alla fine
                    }

                    // Gestisce la sezione "Farmacie di Turno Notturno"
                    else if (lines[0].includes("Farmacie di Turno Notturno")) {
                        nightShiftHTML = `<div><h3 style="color: #4d4351">Farmacie di turno notturno</h3><ul>`;
                        for (let i = 1; i < lines.length; i++) {
                            if (lines[i].trim().startsWith("-")) {
                                const nomeFarmacia = lines[i].replace(/- \*\*/g, '').replace(/\*\*/g, '').trim();                
                                const indirizzo = lines[i + 1] ? lines[i + 1].replace(/\*\*/g, '').split(':')[1]?.trim() : '';                    
                                const telefono = lines[i + 2] ? lines[i + 2].replace(/\*\*/g, '').split(':')[1]?.trim() : '';
                                i += 2;  // Salta alle righe successive per la prossima farmacia
                                nightShiftHTML += `
                                    <li>
                                        <h4><strong>${nomeFarmacia}</strong></h4>
                                        <p><strong>Indirizzo:</strong> ${indirizzo}</p>
                                        <p><strong>Telefono:</strong> ${telefono}</p>
                                    </li>
                                `;
                            }
                        }
                        nightShiftHTML += `</ul></div>`;
                    }

                    // Gestisce la sezione "Farmacie Aperte Oggi"
                    else {
                        pharmaciesHTML += `<div class="farmacie-content">`;
                        for (let i = 1; i < lines.length; i++) {
                            if (lines[i].includes("Farmacia")) {
                                const nomeFarmacia = lines[i].replace(/^\d+\.\s*/, '').replace(/\*\*/g, '').trim();
                                const indirizzo = lines[i + 1] ? lines[i + 1].split(':**')[1].trim() : '';
                                const orari = lines[i + 2] ? lines[i + 2].split(':**')[1].trim() : '';
                                const telefono = lines[i + 3] ? lines[i + 3].split(':**')[1].trim() : '';
                                i += 3;
                                pharmaciesHTML += ` 
                                    <h3><strong>${nomeFarmacia}</strong></h3>
                                    <p><strong>Indirizzo:</strong> ${indirizzo}</p>
                                    <p><strong>Telefono:</strong> ${telefono}</p>
                                    <p><strong>Orari:</strong> ${orari}</p>`;
                            }
                        }
                        pharmaciesHTML += `</div>`;
                    }
                }
            });

            // Aggiungi separatamente i contenuti
            pharmacyContent.innerHTML += pharmaciesHTML;  // Append farmacie aperte oggi
            nightShiftContent.innerHTML = nightShiftHTML;  // Append farmacie di turno notturno
        })
        .catch(error => console.error('Errore nel caricamento di farma.txt:', error));
}




// Orari bus
const url = 'pdf_bus/anconavacanzescolastico_21102024.pdf'; // Percorso del file PDF
const container = document.getElementById('pdf-slider');

async function loadPDF() {
    const pdf = await pdfjsLib.getDocument(url).promise;

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const scale = 1.5;
        const viewport = page.getViewport({ scale: scale });
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport: viewport }).promise;

        const slide = document.createElement('div');
        slide.appendChild(canvas);
        container.appendChild(slide);
    }

    $(document).ready(function() {
        $('#pdf-slider').slick({
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            dots: true,
            autoplay: false
        });
        
        // Mostra lo slider una volta che è pronto
        $('#pdf-slider').css('display', 'block');
    });
}

// Chiama la funzione per caricare il PDF
loadPDF();



// Funzione per caricare e gestire cinema.txt
function loadCinemaFile(filePath) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            const cinemaContent = document.getElementById('cinema-content');
            const sections = data.split('###').slice(1); // Salta la sezione introduttiva

            sections.forEach((section, index) => {
                if (section && section.trim()) {
                    const lines = section.trim().split('\n').filter(line => line.trim() !== ""); // Filtra le righe vuote

                    // Gestisce la sezione delle note separatamente
                    if (lines[0].includes("Informazioni Aggiuntive")) {
                        let informazioniHTML = `<div class="informazioni-aggiuntive scrollable"><h3>Informazioni Aggiuntive:</h3>`;
                        for (let i = 1; i < lines.length; i++) {
                            if (lines[i].trim()) {
                                informazioniHTML += `<p>${lines[i].replace(/- \*\*/g, '').replace(/\*\*/g, '').replace(/^(.*?)(:)/, '<strong>$1</strong>:').trim()}</p>`;
                            }
                        }
                        informazioniHTML += `</div>`;
                        cinemaContent.innerHTML += informazioniHTML;
                        return;
                    }

                    // Estrarre il nome del cinema, indirizzo e telefono
                    const nomeCinema = lines[0].replace(/^\d+\.\s*/, '').replace(/\*\*$/, '').replace(/\*\*/g, '').trim();
                    const indirizzo = lines[1] ? lines[1].split(':**')[1]?.trim() : '';
                    const telefono = lines[2] ? lines[2].split(':**')[1]?.trim() : '';
                    
                    // Genera un ID unico per ogni sezione di programmazione
                    const programmingId = `programmazione-${index}`;

                    // Inizia a costruire la programmazione dei film
                    let moviesHTML = `<h3>Film in programmazione</h3><ul>`;
                    for (let i = 4; i < lines.length; i++) {
                        let riga = lines[i].trim();
                        if (riga.startsWith('- **')) {
                            const matchTitolo = riga.match(/- \*\*(.+?)\*\*/);
                            const titoloFilm = matchTitolo ? matchTitolo[1] : "Titolo non disponibile";
                            let orari = "";
                            if (i + 1 < lines.length && lines[i + 1].includes("Orari:")) {
                                orari = lines[i + 1].split("Orari:")[1]?.trim() || "";
                                i++;
                            }
                            moviesHTML += `<li><strong>${titoloFilm}</strong> | Orari: ${orari}</li>`;
                        }
                    }
                    moviesHTML += `</ul>`;

                    // Crea il blocco HTML per ogni cinema
                    const listHTML = `
                        <div class="cinema-item">
                            <div class="cinema-details">
                                <h2 style="color: #4d4351">${nomeCinema}</h2>
                                <p><strong>Indirizzo:</strong> ${indirizzo}</p>
                                <p><strong>Telefono:</strong> ${telefono}</p>
                            </div>
                            <div class="toggle-button-container">
                                <button class="toggle-button" onclick="toggleProgramming('${programmingId}')">Programmazione</button>
                            </div>
                            <div id="${programmingId}" class="programming-details" style="display: none;">
                                ${moviesHTML}
                            </div>
                        </div>
                    `;
                    cinemaContent.innerHTML += listHTML;
                }
            });
        })
        .catch(error => console.error('Errore nel caricamento di cinema.txt:', error));
}

// Funzione per mostrare/nascondere la sezione di programmazione
function toggleProgramming(programmingId) {
    const programmingDetails = document.getElementById(programmingId);
    programmingDetails.style.display = programmingDetails.style.display === "none" ? "block" : "none";
}


// Carica i file nelle rispettive sezioni
loadCinemaFile('cinema.txt');
loadPharmacyFile('farma.txt');
loadSupermarketFile('supermercati.txt',);
loadTextFile('info.txt', 'info-content');


// Carica l'immagine per la sezione Treni
document.getElementById('treni-image1').src = 'screen_treni/ancona-torrette_full_screenshot.png';
document.getElementById('treni-image2').src = 'screen_treni/ancona_full_screenshot.png';

// Button up
window.addEventListener("scroll", function() {
    const scrollToTopBtn = document.getElementById("scrollToTopBtn");
    scrollToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

// Funzione per scorrere fino in cima
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

