document.addEventListener("DOMContentLoaded", function() {
    let currentPlayer = 1;
    let currentPile = null;
    let hasMoved = false; 

    const statusText = document.getElementById("game-status");
    const switchBtn = document.getElementById("switch-btn");
    const allBtns = document.querySelectorAll(".pile button");
    const extraBtnsDiv = document.querySelector(".extra-btns");

    function otherPlayer() {
        return currentPlayer === 1 ? 2 : 1;
    }

    function updateStatus(message) {
        statusText.textContent = message;
    }

    function disableAllPileBtns() {
        allBtns.forEach(btn => (btn.disabled = true));
    }

    function endGame(gameOverMessage) {
        updateStatus(gameOverMessage);
        disableAllPileBtns();

        if (switchBtn) {
            switchBtn.disabled = true;
        }

        showResetBtn();
    }

    function wasLastStick() {
        const remaining = document.querySelectorAll(".pile button").length;
        if (remaining === 0) {
            // currentPlayer picks last stick => they lose, other player wins
            const message = `GAMEOVER\nPlayer ${otherPlayer()} wins!`;
            endGame(message);
            return true;
        }
        return false;
    }

    function startTurn() {
        if (wasLastStick()) {
            return;
        }
        currentPile = null;
        hasMoved = false;
        updateStatus(`Player ${currentPlayer}'s Turn.`);

        if (switchBtn) {
            switchBtn.disabled = true;
        }
    }

    function switchTurn() {
        if (!hasMoved) {
            updateStatus(`Remove at least one match before switching turns`);
            return;
        }
        currentPlayer = otherPlayer();
        startTurn();
    }

    function onMatchClick(event) {
        const btn = event.target;
        const clickedPile = btn.closest(".pile");

        if (!currentPile) {
            currentPile = clickedPile;
        }
        if (clickedPile !== currentPile) {
            updateStatus(`You can only remove from one pile`);
            return;
        }

        btn.remove();
        hasMoved = true;

        if (switchBtn) {
            switchBtn.disabled = false;
        }

        if (clickedPile.querySelectorAll("button").length === 0) {
            clickedPile.remove();
        }

        if (wasLastStick()) {
            return;
        }
    }

    function showResetBtn() {
        if (document.getElementById("reset-btn")) {
            return;
        }

        if (!extraBtnsDiv) {
            console.error("Error: .extra-btns div not found.");
            return;
        }

        const resetBtn = document.createElement("button");
        resetBtn.id = "reset-btn";
        resetBtn.classList.add("button-91", "home-button");
        resetBtn.textContent = "Reset Game";

        resetBtn.addEventListener("click", resetGame);

        extraBtnsDiv.appendChild(resetBtn);
    }

    function resetGame() {
        location.reload();
    }

    allBtns.forEach(btn => {
        btn.addEventListener("click", onMatchClick);
    });

    if (switchBtn) {
        switchBtn.addEventListener("click", switchTurn);
    }

    startTurn();

    if (switchBtn) {
        switchBtn.disabled = true;
    }
});
