document.addEventListener("DOMContentLoaded", function () {
    const clues = {
        "clue1": "I am the healthiest place in the college",
        "clue2": "I am the most useful place, yet no one uses me!!",
        "clue3": "I am always open",
        "clue4": "Return to the starting point"
    };
    

    let lastClue = localStorage.getItem("lastClue") || null;
    const clueList = document.getElementById("clue-list");
    const scanNextBtn = document.getElementById("scan-next");
    const qrReaderDiv = document.getElementById("qr-reader");

    function updateClueList() {
        clueList.innerHTML = ""; // Clear previous list
        Object.keys(clues).forEach((key) => {
            if (localStorage.getItem(key)) {
                const li = document.createElement("li");
                li.textContent = clues[key];
                clueList.appendChild(li);
            }
        });
    }
    updateClueList();

    let scanner;

    function startQRScanner() {
        qrReaderDiv.style.display = "block";
        scanNextBtn.style.display = "none"; 

        if (typeof Html5QrcodeScanner !== "undefined") {
            scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: 250 });

            scanner.render((decodedText) => {
                decodedText = decodedText.trim();
                console.log("Scanned:", decodedText);

                if (!clues.hasOwnProperty(decodedText)) {
                    alert("❌ Invalid QR Code! Try again.");
                    return;
                }

                const lastClueNumber = lastClue ? parseInt(lastClue.slice(4)) : 0;
                const expectedNextClue = `clue${lastClueNumber + 1}`;

                console.log("Expected:", expectedNextClue);

                if (decodedText === expectedNextClue) {
                    lastClue = decodedText;
                    localStorage.setItem(lastClue, "true"); // Store completed clues

                    updateClueList(); // Append the new clue to the list

                    qrReaderDiv.style.display = "none";
                    scanNextBtn.style.display = "block";

                    scanner.clear();
                    qrReaderDiv.innerHTML = "";
                } else {
                    alert("⚠️ Scan the correct QR in order!");
                }
            });
        } else {
            console.error("❌ QR scanner library not loaded.");
            setTimeout(startQRScanner, 1000);
        }
    }

    scanNextBtn.addEventListener("click", startQRScanner);
    startQRScanner();
});
