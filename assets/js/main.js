class GemPuzzle {
  init() {
    this.body = document.body;

    this.initPopup();

    this.generationBoard();

    this.generationPuzzle();
  }

  generationBoard() {
    const container = document.createElement('div');
    container.classList.add('container');

    let settingsBlock = document.createElement('div');
    settingsBlock.classList.add('setting');

    let sizeBoard = document.createElement('select');
    for (let i = 3; i <= 8; i += 1) {
      let sizeBoardOption = document.createElement('option');
      sizeBoardOption.value = i;
      sizeBoardOption.innerText = `${i}x${i}`;
      if (i === 4) {
        sizeBoardOption.selected = true;
      }
      sizeBoard.append(sizeBoardOption);
    }

    settingsBlock.append(sizeBoard);

    let newGameBtn = document.createElement('button');
    newGameBtn.classList.add('btn');
    newGameBtn.innerText = 'Размешать';
    settingsBlock.append(newGameBtn);

    container.append(settingsBlock);

    this.puzzleBlock = document.createElement('div');
    this.puzzleBlock.classList.add('puzzle_wrapper');
    container.append(this.puzzleBlock);
    this.body.append(container);

    this.puzzleBlock.addEventListener('click', (e) => {
      this.clickPuzzle(e);
    });

    newGameBtn.addEventListener('click', () => {
      this.generationPuzzle();
    });
  }

  generationPuzzle(size = 2) {
    this.clearBoard();

    this.moves = 0;

    const puzzleBlockWidth = this.puzzleBlock.clientWidth;

    this.puzzleWidth = Math.floor(puzzleBlockWidth / size);
    this.puzzles = [];
    this.resultPuzzles = [];
    let numberText = 0;

    for (let i = 0; i < size ** 2; i += 1) {
      numberText = numberText < size ** 2 - 1 ? numberText + 1 : 0;
      this.puzzles.push(numberText);
      this.resultPuzzles.push(numberText);
    }

    this.arrangeItems(size);
  }

  clearBoard() {
    this.puzzleBlock.innerHTML = '';
  }

  arrayRandom() {
    let j;
    let temp;
    for (let i = this.puzzles.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      temp = this.puzzles[j];
      this.puzzles[j] = this.puzzles[i];
      this.puzzles[i] = temp;
    }
  }

  arrangeItems(size) {
    let puzzleLeft = 0;
    let puzzleTop = 0;

    let column = 1;

    this.arrayRandom();

    this.puzzles.forEach((btn) => {
      if (column === size + 1) {
        puzzleLeft = 0;
        puzzleTop += this.puzzleWidth;
        column = 1;
      }
      const puzzle = document.createElement('div');
      puzzle.classList.add('puzzle');
      puzzle.innerText = btn;
      puzzle.style.width = `${this.puzzleWidth}px`;
      puzzle.style.height = `${this.puzzleWidth}px`;
      puzzle.style.left = `${puzzleLeft}px`;
      puzzle.style.top = `${puzzleTop}px`;
      if (btn === 0) {
        this.null = puzzle;
        puzzle.classList.add('null');
      }
      this.puzzleBlock.append(puzzle);
      puzzleLeft += this.puzzleWidth;
      column += 1;
    });

    // console.log(this.puzzles);
    // console.log(this.null);
  }

  clickPuzzle(e) {
    const btn = e.target.closest('.puzzle');
    if (btn) {
      const nullBtn = this.null;
      const nullTop = nullBtn.offsetTop;
      const nullLeft = nullBtn.offsetLeft;
      const nullBottom = nullTop + this.puzzleWidth;
      const nullRight = nullLeft + this.puzzleWidth;

      const btnTop = btn.offsetTop;
      const btnLeft = btn.offsetLeft;
      const btnBottom = btnTop + this.puzzleWidth;
      const btnRight = btnLeft + this.puzzleWidth;

      if (
        (nullTop === btnBottom && nullRight === btnRight && nullLeft === btnLeft)
                || (nullRight === btnLeft && nullTop === btnTop && nullBottom === btnBottom)
                || (nullBottom === btnTop && nullRight === btnRight && nullLeft === btnLeft)
                || (nullLeft === btnRight && nullTop === btnTop && nullBottom === btnBottom)
      ) {
        this.swap(btn, nullTop, nullLeft, btnTop, btnLeft);
        this.moves += 1;
        this.check();
      }
    }
  }

  swap(btnActive, nullTop, nullLeft, btnTop, btnLeft) {
    const btn = btnActive;
    btn.style.top = `${nullTop}px`;
    btn.style.left = `${nullLeft}px`;

    this.null.style.top = `${btnTop}px`;
    this.null.style.left = `${btnLeft}px`;

    const keyBtn = this.puzzles.indexOf(+btn.innerText);
    const keyNull = this.puzzles.indexOf(0);
    this.puzzles[keyBtn] = 0;
    this.puzzles[keyNull] = +btn.innerText;
  }

  check() {
    let checkBool = true;
    this.puzzles.forEach((item, i) => {
      if (item !== this.resultPuzzles[i]) {
        checkBool = false;
      }
    });

    if (checkBool) {
      this.win();
    }
  }

  win() {
    this.popupText.innerText = `Ура! Вы решили головоломку за ##:## и ${this.moves} ходов`;
    this.openPopup();
  }

  initPopup() {
    this.popupText = document.createElement('div');
    this.popupText.classList.add('popup_text');
    this.popupBtn = document.createElement('button');
    this.popupBtn.classList.add('btn');
    this.popupBtn.innerText = 'Начать заново';
    this.popup = document.createElement('div');
    this.popup.classList.add('popup');
    this.popupBlock = document.createElement('div');
    this.popupBlock.classList.add('popup_block');

    this.popupBlock.append(this.popupText);
    this.popupBlock.append(this.popupBtn);
    this.popup.append(this.popupBlock);
    this.body.append(this.popup);

    this.popupBtn.addEventListener('click', () => {
      this.closePopup();
    });
  }

  openPopup() {
    this.popup.classList.add('active');
  }

  closePopup() {
    this.popup.classList.remove('active');

    this.generationPuzzle();
  }
}

const puzzle = new GemPuzzle();

puzzle.init();
