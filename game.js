document.addEventListener("DOMContentLoaded", function () {
    const clues = {
        "clue1": "Go to the library entrance and scan the next QR code.",
        "clue2": "Find the canteen's notice board and scan the next QR code.",
        "clue3": "Check the computer lab's door for the next clue.",
        "clue4": "Final clue: Meet at the auditorium!"
    };

    let scannedClues = JSON.parse(localStorage.getItem("scannedClues")) || [];
    const clueList = document.getElementById("clue-list");
    const scanNextBtn = document.getElementById("scan-next");
    const qrReaderDiv = document.getElementById("qr-reader");

    function updateClueDisplay() {
        clueList.innerHTML = ""; // Clear existing list
        scannedClues.forEach(clue => {
            let li = document.createElement("li");
            li.textContent = clue;
            clueList.appendChild(li);
        });
    }
    updateClueDisplay();

    let scanner;

    function startQRScanner() {
        qrReaderDiv.style.display = "block"; // Show scanner
        scanNextBtn.style.display = "none"; // Hide scan button

        if (typeof Html5QrcodeScanner !== "undefined") {
            scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });

            scanner.render((decodedText) => {
                decodedText = decodedText.trim();
                console.log("Scanned:", decodedText);

                if (!clues.hasOwnProperty(decodedText)) {
                    alert("❌ Invalid QR Code! Try again.");
                    return;
                }

                const expectedNextClue = `clue${scannedClues.length + 1}`;

                if (decodedText !== expectedNextClue) {
                    alert("⚠️ Scan the correct QR in order!");
                    return;
                }

                scannedClues.push(clues[decodedText]);
                localStorage.setItem("scannedClues", JSON.stringify(scannedClues));

                updateClueDisplay();
                qrReaderDiv.style.display = "none"; // Hide scanner
                scanNextBtn.style.display = "block"; // Show scan next button
            });
        } else {
            console.error("❌ QR scanner library not loaded.");
            setTimeout(startQRScanner, 1000);
        }
    }

    scanNextBtn.addEventListener("click", startQRScanner);
    startQRScanner();
});
