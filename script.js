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

// Keep the adopted dog's information together in one simple object.
let virtualDog = null;
const adoptionForm = document.querySelector('#adoption-form');
const nameInput = document.querySelector('#dog-name');
const breedInput = document.querySelector('#dog-breed');
const nameError = document.querySelector('#name-error');
const petMessage = document.querySelector('#pet-message');
const breedImages = {
  'Beagle': 'assets/beagle.svg',
  'Golden Retriever': 'assets/golden-retriever.svg',
  'Poodle': 'assets/poodle.svg'
};

function adoptDog(event) {
  event.preventDefault();
  const name = nameInput.value.trim();

  if (name.length === 0 || name.length > 20) {
    nameError.textContent = name.length === 0
      ? 'Please enter a dog name, not just spaces.'
      : 'Please use a dog name with 20 characters or fewer.';
    nameInput.setAttribute('aria-invalid', 'true');
    nameInput.focus();
    return;
  }

  nameError.textContent = '';
  nameInput.removeAttribute('aria-invalid');
  virtualDog = {
    name: name,
    breed: breedInput.value,
    day: 1,
    growthStage: 'Puppy',
    happiness: 50
  };

  updateDogDisplay();
  adoptionForm.hidden = true;
  document.querySelector('#pet-panel').hidden = false;
  petMessage.textContent = 'Welcome to the park! Feed or play to add 10 happiness.';
  document.querySelector('#pet-name').focus();
}

function updateDogDisplay() {
  // textContent displays names literally, even if they contain HTML characters.
  document.querySelector('#pet-name').textContent = virtualDog.name;
  document.querySelector('#pet-breed').textContent = virtualDog.breed;
  document.querySelector('#pet-day').textContent = virtualDog.day;
  document.querySelector('#pet-stage').textContent = virtualDog.growthStage;
  document.querySelector('#pet-happiness').textContent = virtualDog.happiness;
  const petImage = document.querySelector('#pet-image');
  petImage.src = breedImages[virtualDog.breed];
  petImage.alt = 'Illustration of a ' + virtualDog.breed + '.';
}

function increaseHappiness() {
  if (virtualDog === null) {
    return;
  }

  // Math.min chooses the smaller number, so happiness cannot go above 100.
  virtualDog.happiness = Math.min(100, virtualDog.happiness + 10);
  updateDogDisplay();
  petMessage.textContent = virtualDog.happiness === 100
    ? 'Happiness is 100 / 100. Your dog is as happy as can be!'
    : 'Your dog enjoyed that! Happiness is now ' + virtualDog.happiness + ' / 100.';
}

adoptionForm.addEventListener('submit', adoptDog);
document.querySelector('#feed-button').addEventListener('click', increaseHappiness);
document.querySelector('#play-button').addEventListener('click', increaseHappiness);
