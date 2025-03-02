document.addEventListener("DOMContentLoaded", function () {
    const clues = {
        "clue1": "Go to the library entrance and scan the next QR code.",
        "clue2": "Find the canteen's notice board and scan the next QR code.",
        "clue3": "Check the computer lab's door for the next clue.",
        "clue4": "Final clue: Meet at the auditorium!"
    };

    let lastClue = localStorage.getItem("lastClue") || null;
    const clueDisplay = document.getElementById("clue");
    const revealDiv = document.getElementById("reveal");
    const scanNextBtn = document.getElementById("scan-next");
    const qrReaderDiv = document.getElementById("qr-reader");

    function updateClueText() {
        clueDisplay.innerText = lastClue ? clues[lastClue] : "Scan the first QR to start!";
    }
    updateClueText();

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
                    clueDisplay.innerText = "❌ Invalid QR Code! Try again.";
                    setTimeout(updateClueText, 1000); // Restore clue after 1s
                    return;
                }

                const lastClueNumber = lastClue ? parseInt(lastClue.slice(4)) : 0;
                const expectedNextClue = `clue${lastClueNumber + 1}`;

                console.log("Expected:", expectedNextClue);

                // **Fix: Only update lastClue when the correct QR is scanned**
                if (decodedText !== expectedNextClue) {
                    clueDisplay.innerText = "⚠️ Scan the correct QR in order!";
                    setTimeout(updateClueText, 1000); // Restore clue after 1s
                    return;
                }

                // Update last clue only if scanned in order
                lastClue = decodedText;
                localStorage.setItem("lastClue", lastClue);

                revealDiv.style.display = "block";
                setTimeout(() => {
                    revealDiv.style.display = "none";
                    updateClueText();
                    qrReaderDiv.style.display = "none";
                    scanNextBtn.style.display = "block";
                }, 1000);

                scanner.clear();
                qrReaderDiv.innerHTML = "";
            });
        } else {
            console.error("❌ QR scanner library not loaded.");
            setTimeout(startQRScanner, 1000);
        }
    }

    scanNextBtn.addEventListener("click", startQRScanner);
    startQRScanner();
});
