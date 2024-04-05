document.addEventListener('DOMContentLoaded', async () => {

    const card = document.getElementsByClassName('grid-item')[0]
    const carteContainer = document.getElementsByClassName('carte')[0]

    for (let i = 0; i < 15; i++) {
        carteContainer.appendChild(card.cloneNode(true))
    }

    const cards = document.querySelectorAll('.grid-item');
    let lockBoard = true;
    let firstCard, secondCard;
    let remainingPairs = cards.length / 2;
    let startTime, endTime;
    const link = 'https://picsum.photos/300/300';

    await shuffleCards();

    cards.forEach(card => card.addEventListener('click', flipCard));
    function flipCard() {
        if (lockBoard || this.classList.contains('flip')) return;

        if (!startTime) {
            startTime = new Date(); // Avvia il timer solo se è il primo clic
        }

        revealCard(this);

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }
    function revealCard(card) {
        card.classList.add('flip');
    }
    function checkForMatch() {
        lockBoard = true;

        const firstImage = firstCard.querySelector('.gameImage').src;
        const secondImage = secondCard.querySelector('.gameImage').src;

        if (firstImage === secondImage) {
            setTimeout(disableCards, 1000);
        } else {
            setTimeout(unflipCards, 1000);
        }
    }
    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        firstCard = null;
        secondCard = null;
        remainingPairs--;
        document.querySelector('p').textContent = `Coppie rimanenti: ${remainingPairs}`;
        lockBoard = false;

        if (remainingPairs === 0) {
            endTime = new Date(); // Imposta il tempo di fine una volta che tutte le coppie sono state trovate
            endGame();
        }
    }
    function unflipCards() {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        firstCard = null;
        secondCard = null;
        lockBoard = false;
    }

    async function getImageObject(index) {
        const response = await fetch(link);
        const blob = await response.blob();
        return {index:index, src:URL.createObjectURL(blob)}
    }
    async function shuffleCards() {
        const cardImages = document.querySelectorAll('.gameImage');

        let srcArray = [...Array(8).keys()].map(getImageObject);
        srcArray = await Promise.all([...srcArray, ...srcArray]);

        const shuffledSrcArray = shuffleArray(srcArray);

        cardImages.forEach((img, index) => {
            img.src = shuffledSrcArray[index].src;
        });
        lockBoard = false;
    }
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    function endGame() {
        const container = document.getElementsByClassName('container')[0]
        container.classList.add('d-none');

        const end = document.getElementsByClassName('end')[0]
        end.classList.remove('d-none');

        const elapsedTime = (endTime - startTime) / 1000;
        const elapsedTimeElement = document.getElementsByClassName('time')[0];
        elapsedTimeElement.innerText= elapsedTime;
    }
    function rematch() {

        const container = document.getElementsByClassName('container')[0]
        container.classList.remove('d-none');

        const end = document.getElementsByClassName('end')[0]
        end.classList.add('d-none');
    }
});
