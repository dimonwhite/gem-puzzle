class GemPuzzle {
  init() {
    this.body = document.body;

    this.saveStorage = JSON.parse(sessionStorage.getItem('saveGame'));

    this.size = this.saveStorage ? this.saveStorage.size : 4;

    this.initPopup();

    this.generationBoard();

    if (this.saveStorage) {
      this.generationSaveGame();
    } else {
      this.generationPuzzle();
    }

    if (!localStorage.getItem('result')) {
      this.result = [];
    } else {
      this.result = JSON.parse(localStorage.getItem('result'));
    }
  }

  generationBoard() {
    const container = document.createElement('div');
    container.classList.add('container');

    this.settingsBlock = document.createElement('div');
    this.settingsBlock.classList.add('setting');

    const sizeBoardWrap = document.createElement('div');
    sizeBoardWrap.classList.add('size_board');
    const sizeBoard = document.createElement('select');
    for (let i = 3; i <= 8; i += 1) {
      const sizeBoardOption = document.createElement('option');
      sizeBoardOption.value = i;
      sizeBoardOption.innerText = `${i}x${i}`;
      if (i === this.size) {
        sizeBoardOption.selected = true;
      }
      sizeBoard.append(sizeBoardOption);
    }
    sizeBoardWrap.append(document.createTextNode('Размер поля: '));
    sizeBoardWrap.append(sizeBoard);
    this.settingsBlock.append(sizeBoardWrap);

    this.generationStopwatch(this.settingsBlock);

    const movesBlock = document.createElement('div');
    movesBlock.classList.add('moves_block');
    this.movesText = document.createElement('span');
    this.movesText.innerText = this.saveStorage ? this.saveStorage.moves : '0';
    movesBlock.append(document.createTextNode('Количество ходов: '));
    movesBlock.append(this.movesText);

    this.settingsBlock.append(movesBlock);

    const settingsBlockBottom = document.createElement('div');
    settingsBlockBottom.classList.add('setting_bottom');

    const newGameBtn = document.createElement('button');
    newGameBtn.classList.add('btn');
    newGameBtn.innerText = 'Размешать';
    settingsBlockBottom.append(newGameBtn);

    const resultBtn = document.createElement('button');
    resultBtn.classList.add('btn');
    resultBtn.innerText = 'Результаты';
    settingsBlockBottom.append(resultBtn);

    const saveBtn = document.createElement('button');
    saveBtn.classList.add('btn');
    saveBtn.innerText = 'Сохранить';
    settingsBlockBottom.append(saveBtn);

    this.settingsBlock.append(settingsBlockBottom);

    container.append(this.settingsBlock);

    this.puzzleBlock = document.createElement('div');
    this.puzzleBlock.classList.add('puzzle_wrapper');
    container.append(this.puzzleBlock);
    this.body.append(container);

    this.puzzleBlock.addEventListener('click', (e) => {
      this.clickPuzzle(e);
    });

    newGameBtn.addEventListener('click', () => {
      this.generationPuzzle(this.size);
    });

    resultBtn.addEventListener('click', () => {
      this.getResult();
    });

    saveBtn.addEventListener('click', () => {
      this.saveGame();
    });

    sizeBoard.addEventListener('change', (e) => {
      this.size = +e.target.value;
      this.generationPuzzle(this.size);
    });
  }

  generationPuzzle(size = 4) {
    this.size = size;
    this.saveStorage = '';
    sessionStorage.removeItem('saveGame');
    clearInterval(this.stopwatchCounter);
    this.clearBoard();

    this.stopwatch();

    this.moves = 0;
    this.movesText.innerText = this.moves;

    const puzzleBlockWidth = this.puzzleBlock.clientWidth;

    this.puzzleWidth = Math.floor(puzzleBlockWidth / size);
    this.puzzles = [];
    this.resultPuzzles = [];
    let numberText = 0;

    for (let i = 0; i < this.size ** 2; i += 1) {
      numberText = numberText < this.size ** 2 - 1 ? numberText + 1 : 0;
      this.puzzles.push(numberText);
      this.resultPuzzles.push(numberText);
    }

    this.arrangeItems(this.size);
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

    if (!this.saveStorage) {
      this.arrayRandom();
    }

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
        this.changeMoves();
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
    this.result.push({
      size: `${this.size}x${this.size}`,
      time: this.stopwatchBlock.innerText,
      moves: this.moves,
    });

    this.saveResult();

    this.popupText.innerText = `Ура! Вы решили головоломку за ${this.stopwatchBlock.innerText} и ${this.moves} ходов`;
    clearInterval(this.stopwatchCounter);
    this.openPopup(this.popupWin);
  }

  initPopup() {
    this.popupText = document.createElement('div');
    this.popupText.classList.add('popup_text');
    const popupBtn = document.createElement('button');
    popupBtn.classList.add('btn');
    popupBtn.innerText = 'Начать заново';
    this.popup = document.createElement('div');
    this.popup.classList.add('popup');
    this.popupWin = document.createElement('div');
    this.popupWin.classList.add('popup_block');

    this.popupWin.append(this.popupText);
    this.popupWin.append(popupBtn);
    this.popup.append(this.popupWin);
    this.body.append(this.popup);

    popupBtn.addEventListener('click', () => {
      this.closePopup(this.popupWin);
      this.generationPuzzle(this.size);
    });

    this.popupResult = document.createElement('div');
    this.popupResult.classList.add('popup_block', 'popup_result');
    const popupBtnResult = document.createElement('button');
    popupBtnResult.classList.add('btn');
    popupBtnResult.innerText = 'Закрыть';
    this.popupResultList = document.createElement('div');
    this.popupResultList.classList.add('popup_result_list');

    this.popupResult.append(this.popupResultList);
    this.popupResult.append(popupBtnResult);

    this.popup.append(this.popupResult);

    popupBtnResult.addEventListener('click', () => {
      this.closePopup(this.popupResult);
    });
  }

  openPopup(popupBlock) {
    this.popup.classList.add('active');
    popupBlock.classList.add('active');
  }

  closePopup(popupBlock) {
    this.popup.classList.remove('active');
    popupBlock.classList.remove('active');
  }

  generationStopwatch(block) {
    this.minuteText = document.createElement('span');
    this.secondText = document.createElement('span');
    this.stopwatchBlock = document.createElement('div');

    this.stopwatchBlock.classList.add('stopwatch');
    this.minuteText.classList.add('stopwatch_item');
    this.secondText.classList.add('stopwatch_item');

    this.stopwatchBlock.append(this.minuteText);
    this.stopwatchBlock.append(document.createTextNode(':'));
    this.stopwatchBlock.append(this.secondText);

    block.append(this.stopwatchBlock);
  }

  stopwatch() {
    let second = this.saveStorage ? this.saveStorage.second : '00';
    let minute = this.saveStorage ? this.saveStorage.minute : '00';

    this.secondText.innerText = second;
    this.minuteText.innerText = minute;

    this.stopwatchCounter = setInterval(() => {
      second = +second + 1;
      if (second < 10) {
        second = `0${second}`;
      }
      if (second === 60) {
        second = '00';
        minute = +minute + 1;
        if (minute < 10) {
          minute = `0${minute}`;
        }
      }
      this.secondText.innerText = second;
      this.minuteText.innerText = minute;
    }, 1000);
  }

  changeMoves() {
    this.movesText.innerText = this.moves;
  }

  saveResult() {
    this.result = this.result.sort((a, b) => a.moves - b.moves);

    if (this.result.length > 10) {
      this.result = this.result.slice(0, 10);
    }

    localStorage.setItem('result', JSON.stringify(this.result));
  }

  getResult() {
    this.popupResultList.innerHTML = `
      <div class="popup_result_list_item title">
        <span>Размер</span>
        <span>Время</span>
        <span>Ходы</span>
      </div>
    `;
    this.result.forEach((item) => {
      this.popupResultList.innerHTML += `
        <div class="popup_result_list_item">
          <span>${item.size}</span>
          <span>${item.time}</span>
          <span>${item.moves}</span>
        </div>
      `;
    });
    this.openPopup(this.popupResult);
  }

  saveGame() {
    this.saveStorage = {
      size: this.size,
      puzzles: this.puzzles,
      moves: this.moves,
      second: this.secondText.innerText,
      minute: this.minuteText.innerText,
    };

    sessionStorage.setItem('saveGame', JSON.stringify(this.saveStorage));
  }

  generationSaveGame() {
    clearInterval(this.stopwatchCounter);
    this.clearBoard();

    this.stopwatch();

    this.moves = this.saveStorage.moves;

    const puzzleBlockWidth = this.puzzleBlock.clientWidth;

    const { size } = this.saveStorage;

    this.puzzleWidth = Math.floor(puzzleBlockWidth / size);
    this.puzzles = this.saveStorage.puzzles;
    this.resultPuzzles = [];
    let numberText = 0;

    for (let i = 0; i < size ** 2; i += 1) {
      numberText = numberText < size ** 2 - 1 ? numberText + 1 : 0;
      this.resultPuzzles.push(numberText);
    }

    this.arrangeItems(size);
  }
}

const puzzle = new GemPuzzle();

puzzle.init();
