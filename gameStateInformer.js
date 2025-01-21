document.addEventListener("DOMContentLoaded", function() {
    let currentPlayer = 1;
    let currentPile = null;
    let hasMoved = false; 

    const statusText = document.getElementById("game-status");
    const switchBtn = document.getElementById("switch-btn");
    const allButtons = document.querySelectorAll(".pile button");
    const extraBtnsDiv = document.querySelector(".extra-btns");

    function otherPlayer() {
        return currentPlayer === 1 ? 2 : 1;
    }

    function updateStatus(message) {
        statusText.textContent = message;
    }

    function disableAllPileButtons() {
        allButtons.forEach(btn => (btn.disabled = true));
    }

    function endGame(gameOverMessage) {
        updateStatus(gameOverMessage);
        disableAllPileButtons();

        if (switchBtn) {
            switchBtn.disabled = true;
        }

        showResetButton();
    }

    function checkIfPlayerHasNoMove() {
        const remaining = document.querySelectorAll(".pile button").length;
        if (remaining === 0) {
            // currentPlayer has no moves left => they lose, other player wins
            const message = `All piles are empty. Player ${currentPlayer} has no moves and loses!\n` +
                `Player ${otherPlayer()} wins!`;
            endGame(message);
            return true;
        }
        return false;
    }

    function startTurn() {
        if (checkIfPlayerHasNoMove()) {
            return;
        }
        currentPile = null;
        hasMoved = false;
        updateStatus(`Player ${currentPlayer}'s Turn. Click a pile to remove matches.`);

        
        if (switchBtn) {
            switchBtn.disabled = true;
        }
    }

    function switchTurn() {
        if (!hasMoved) {
            updateStatus(`You must remove at least one match before switching turns.`);
            return;
        }
        currentPlayer = otherPlayer();
        startTurn();
    }

    function onMatchClick(event) {
        const button = event.target;
        const clickedPile = button.closest(".pile");

        if (!currentPile) {
            currentPile = clickedPile;
        }
        if (clickedPile !== currentPile) {
            updateStatus(`You can only remove from one pile this turn!`);
            return;
        }

        button.remove();
        hasMoved = true;

    
        if (switchBtn) {
            switchBtn.disabled = false;
        }


        if (clickedPile.querySelectorAll("button").length === 0) {
            clickedPile.remove();
        }

        if (checkIfPlayerHasNoMove()) {
            return;
        }
    }

    function showResetButton() {
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

    allButtons.forEach(button => {
        button.addEventListener("click", onMatchClick);
    });

    if (switchBtn) {
        switchBtn.addEventListener("click", switchTurn);
    }

    startTurn();

    
    if (switchBtn) {
        switchBtn.disabled = true;
    }
});
