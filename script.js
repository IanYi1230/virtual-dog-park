// The breed information stays in HTML so it works even without JavaScript.
// This small extra feature introduces a randomly selected dog.
const dogCards = document.querySelectorAll('.dog-card');
const surpriseButton = document.querySelector('#surprise-button');
const discoveryMessage = document.querySelector('#discovery-message');
let previousIndex = -1;

document.querySelector('#discovery').hidden = false;

surpriseButton.addEventListener('click', function () {
  // Avoid picking the same dog twice in a row.
  let nextIndex = Math.floor(Math.random() * dogCards.length);
  if (nextIndex === previousIndex) {
    nextIndex = (nextIndex + 1) % dogCards.length;
  }
  previousIndex = nextIndex;

  dogCards.forEach(function (card) {
    card.classList.remove('is-picked');
  });

  const chosenCard = dogCards[nextIndex];
  const dogName = chosenCard.querySelector('h3').textContent;
  chosenCard.classList.add('is-picked');
  discoveryMessage.textContent = 'Meet the ' + dogName + '! Your next park friend is highlighted above.';

  // Move keyboard focus as well as the view to the selected dog.
  chosenCard.focus({ preventScroll: true });
  chosenCard.scrollIntoView({ block: 'start' });
});
