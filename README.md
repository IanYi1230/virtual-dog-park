# Virtual Dog Park

A dog encyclopedia and virtual pet website built for a first-year programming lab.

The project uses only HTML, CSS, and vanilla JavaScript. It has no framework, backend, external API, or package dependencies.

## Features

- A Dog Encyclopedia with size, personality, and everyday care notes for Beagle, Golden Retriever, and Poodle.
- A “Pick a dog for me” button that highlights a breed to explore.
- Adoption of one virtual dog, with a breed choice and a name of up to 20 characters. Leading and trailing whitespace is trimmed; spaces inside the name are kept. Blank names are rejected, and names are displayed safely as text.
- Feed, Play, and Next Day buttons, with happiness, day, growth stage, and a visible growth bar.
- Automatic saving after adoption and every care action, plus restoration after refreshing.
- Start Over with confirmation: cancelling keeps the dog; confirming deletes its saved progress and returns to the adoption form.
- Responsive styling, labeled controls, image alt text, and keyboard focus indicators.

## Illustrations

The SVG files in `assets/` are project-created illustrations, not real dog photographs. All three illustrations are local files; no external image service is needed.

## Preview locally

1. Open the project folder in Visual Studio Code.
2. Enable the optional **Live Server** extension by Ritwick Dey if it is not already available.
3. Right-click `index.html` and choose **Open with Live Server**.
4. Use the local HTTP address that opens in your browser. Keep Live Server running while using the page.

No build step or package manager is needed. Use the same browser profile and local address, including the port, when checking saved progress. Changing between `localhost` and `127.0.0.1`, changing ports, or using a different browser gives the page a separate storage location. A local server is recommended instead of opening the HTML file directly so browser storage has a consistent site address.

## Growth and happiness rules

- A newly adopted dog starts on **Day 1**, as a **Puppy**, with **50 happiness**.
- **Days 2 and 3:** Young Dog.
- **Day 4 onward:** Adult Dog.
- **Feed** and **Play** each add **10 happiness**, up to a maximum of **100**.
- **Next Day** advances the day by **1** and subtracts **5 happiness**, down to a minimum of **0**.
- Days advance only when Next Day is clicked; refreshing or waiting does not advance time.
- The growth bar fills through Day 4 and stays full for adult dogs. The stage is also shown in text.

## Where progress is saved

Pet progress is stored locally in the browser's `localStorage` under the key `virtualDogParkPetV1`. One saved entry holds the dog's name, breed, day, and happiness. The growth stage is calculated from the day.

Progress is **not stored in a GitHub account** or uploaded to a server. Pushing the project to GitHub does not save or sync a pet. Saves belong to the browser profile and site address being used; they do not automatically transfer to another browser or device. Clearing site data or confirming Start Over removes the save. Private browsing may discard it when the private session ends.

If browser storage is unavailable or a save is invalid, the page shows a helpful message. Playing may still work, but saving is not guaranteed in that situation.

## Manual testing checklist

These are checks to perform manually, not a record of completed browser tests. Use a test dog, since confirming Start Over deletes its progress.

- [ ] Check the encyclopedia shows exactly the three breeds and their illustrations. Try “Meet the dogs,” “Pick a dog for me,” and “Back to top.”
- [ ] Submit an empty name and a name containing only spaces; check that a helpful error appears. Adopt with `  Sir  Wags  ` and check that outer spaces are removed and inner spaces remain. Check the 20-character limit; `<b>Buddy</b>` should appear literally as a name.
- [ ] Try adoption with each breed, using Start Over between dogs. Check the correct illustration, breed, Day 1, Puppy stage, and happiness 50.
- [ ] Click Feed and Play; each should add 10. Repeat until happiness reaches 100 and check that it never exceeds 100.
- [ ] Click Next Day through Days 2, 3, 4, and 5. Check the stages, growth bar, and a 5-point happiness decrease per click. Keep advancing and check that happiness stops at 0.
- [ ] Refresh after adoption and after each of Feed, Play, and Next Day. Check that the name, breed, day, happiness, stage, and growth bar restore correctly.
- [ ] Click Start Over and cancel; check the dog remains after refreshing. Then confirm Start Over; check the adoption form returns and still appears after refreshing.
- [ ] Check a narrow phone-sized window and a laptop-sized window. Use Tab and Enter to reach and operate controls; check visible focus, readable text, and no horizontal scrolling.
