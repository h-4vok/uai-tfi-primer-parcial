const images = [
  "https://cdn130.picsart.com/303874851115201.jpg?c256x256",
  "https://styles.redditmedia.com/t5_2sbq3/styles/communityIcon_0kgik2jq6y301.png",
  "https://cdn140.picsart.com/290512548038201.jpg?c256x256",
  "https://cdn131.picsart.com/295453510164201.jpg?c256x256",
  "https://cdn140.picsart.com/301883890144201.jpg?c256x256",
  "https://b.thumbs.redditmedia.com/idkL6xlYE_o3eBCL0Dz7V7UjrwzYWr-qw4KfKjTLtGg.png"
];

const controls = {
  imagesWrapper: null,
  resetButton: null
};

const game = {
  urlsToIndexes: {},

  indexesToUrls: {},

  currentlySelectedIndex: null,

  solvedImages: 0,

  reset: () => {
    this.urlsToIndexes = {};
    this.indexesToUrls = {};
    this.currentlySelectedIndex = null;
    this.solvedImages = 0;

    game.setImages();
    game.startTimer();
  },

  resolveUserSelection: index => {
    const selectedDiv = document.querySelector(`#image-div-${index}`);
    selectedDiv.style.visibility = "";

    const isFirstSelection = game.currentlySelectedIndex === null;
    if (isFirstSelection) {
      game.currentlySelectedIndex = index;

      return;
    }

    const currentSelectionUrl = indexesToUrls[game.currentlySelectedIndex];
    const newSelectionUrl = indexesToUrls[index];

    const isMatch = currentSelectionUrl === newSelectionUrl;
    if (isMatch) {
      this.solvedImages += 2;

      if (this.solvedImages === images.length * 2) {
        alert("Ganaste piscuí");
      }

      game.currentlySelectedIndex = null;
    } else {
      controls.imagesWrapper.style.pointerEvents = "none";

      window.setTimeout(() => {
        const otherPairDiv = document.querySelector(
          `#image-div-${game.currentlySelectedIndex}`
        );
        otherPairDiv.style.visibility = "hidden";
        selectedDiv.style.visibility = "hidden";

        game.currentlySelectedIndex = null;
        controls.imagesWrapper.style.pointerEvents = "";
      }, 1000);
    }
  },

  setImages: () => {
    const buildDiv = (index, imageSrc) =>
      `<div class="single-wrapper" index="${index}"><div id="image-div-${index}" index="${index}" style="background-image: url(${imageSrc});"></div></div>`;

    const newDivs = [];
    let expectedImagesArray = [...images, ...images];

    // Sort the array in a random way
    expectedImagesArray = expectedImagesArray.sort(
      (a, b) => Math.round(Math.random() * 2) - 1
    );

    for (let i = 0; i < expectedImagesArray.length; i++) {
      const imageSrc = expectedImagesArray[i];
      if (!this.urlsToIndexes[imageSrc]) {
        this.urlsToIndexes[imageSrc] = [i];
      } else {
        this.urlsToIndexes[imageSrc].push(i);
      }

      this.indexesToUrls[i] = imageSrc;

      const currentDiv = buildDiv(i, imageSrc);
      newDivs.push(currentDiv);
    }

    const divsHtml = newDivs.join("");
    controls.imagesWrapper.innerHTML = divsHtml;
  },

  startTimer: () => {
    controls.resetButton.disabled = "disabled";

    window.setTimeout(() => {
      game.enableReset();
      game.hideImagesAndSetListeners();
    }, 3000);
  },

  enableReset: () => {
    controls.resetButton.disabled = "";
  },

  hideImagesAndSetListeners: () => {
    const singleWrappers = document.querySelectorAll(
      "#images-wrapper .single-wrapper"
    );

    for (let div of Object.values(singleWrappers)) {
      const child = div.children[0];

      div.addEventListener("click", () => {
        if (child.visibility === "") return;

        game.resolveUserSelection(div.getAttribute("index"));
      });

      child.style.visibility = "hidden";
    }
  }
};

class MemotestImage {
  constructor($el) {}
}

function init() {
  function initControls() {
    controls.imagesWrapper = document.querySelector("#images-wrapper");
    controls.resetButton = document.querySelector("#reset");

    controls.resetButton.addEventListener("click", () => game.reset());
  }

  initControls();
  game.reset();
}

document.addEventListener("DOMContentLoaded", init);
