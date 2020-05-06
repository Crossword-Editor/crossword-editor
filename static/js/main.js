  // get json string from django, use it to pass in to Vue app
  let puzzleData = JSON.parse(document.querySelector("#puzzle-data").textContent)
  let totalCellNumber = puzzleData.size.colN * puzzleData.size.rowN
  puzzleData.circles = puzzleData.circles ? puzzleData.circles : Array(totalCellNumber).fill(0)

  const BLACK = '.'


  Vue.component('letter-distribution', {
    extends: VueChartJs.Bar,
    mixins: [VueChartJs.mixins.reactiveProp],
    props: ['chartData'],
    data: function () {
      return {
        chartOptions: {
          tooltips: {
            enabled: false
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      }
    },
    mounted() {
      this.renderChart(this.chartData, this.chartOptions)
    }
  })


  /* ================ CLUE Component =================================*/
  Vue.component("x-clue", {
    template: `
      <li class="clue" :class="clueClasses" @click="clicked">
        <slot></slot>
      </li>`,
    props: ['direction', 'gridnums', 'highlighted', 'clueType', 'number', 'crossNumbers'],
    data: function () {
      return {
        test: 1
      };
    },
    computed: {
      isHighlighted() {
        return this.direction === this.clueType && this.gridnums[this.highlighted[0]] == this.number
      },
      isSecondary() {
        return this.direction !== this.clueType && this.crossNumbers[0] == this.number
      },
      clueClasses() {
        return { highlighted: this.isHighlighted, secondary: this.isSecondary }
      }
    },
    watch: {
      isHighlighted: function () {
        this.$nextTick(function () {
          this.scrollClues()
        })
      },
    },
    methods: {
      clicked() {
        this.$emit("clue-clicked", this.number, this.clueType);
      },
      scrollClues() {
        let highlightedClue = document.querySelector('.clue.highlighted')
        let secondaryHlClue = document.querySelector('.clue.secondary')
        if (highlightedClue) {
          highlightedClue.scrollIntoView({ behavior: "smooth", block: "center" })
          secondaryHlClue.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }
    }
  });



  /* ================ CELL Component =================================*/
  Vue.component("x-cell", {
    template: `
      <div class="cell" :class="cellClasses" :style="cellStyle" @click="clicked">
        <slot name="number"></slot>
        <slot name="entry"></slot>
      </div>`,
    props: ['idx', 'activeCell', 'inputArea', 'grid', 'highlighted', 'colN', 'rowN', 'circles'],
    data: function () {
      return {
        test: 1
      };
    },
    computed: {
      isActive() {
        return this.idx === this.activeCell;
      },
      currentInput() {
        return this.idx === this.inputArea;
      },
      isBlack() {
        return this.grid[this.idx] === BLACK
      },
      isHighlighted() {
        return this.highlighted.includes(this.idx)
      },
      cellClasses() {
        return {
          active: this.isActive,
          black: this.isBlack,
          highlighted: this.isHighlighted,
          rebus: this.grid[this.idx].length > 1,
          circle: this.circles[this.idx] === 1
        }
      },
      cellStyle() {
        let max = Math.max(this.rowN, this.colN)
        return { 'width': `${525 / max}px`, 'height': `${525 / max}px` }
      }
    },
    methods: {
      clicked() {
        this.$emit("cell-clicked", this.idx)
      }
    }
  });



  /* ================ Editor APP =================================*/
  const editor = new Vue({
    el: "#editor-app",
    delimiters: ["${", "}"],
    data: {
      grid: puzzleData.grid, // flat array representation of the grid (left->right, top->bottom)
      clues: puzzleData.clues,
      rowN: puzzleData.size.rowN,
      colN: puzzleData.size.colN,
      title: puzzleData.title,
      description: puzzleData.description,
      author: puzzleData.author,
      symmetry: puzzleData.symmetry, // default: rotational (other values: none, vertical, horizontal )
      completed: completed, // 'completed' variable created in puzzle.html; value passied in from Django context
      isVertical: false,
      BLACK: '.',
      across: 'across', // string needed for x-clue component prop
      down: 'down', // string needed for x-clue component prop
      activeCell: 0,
      inputArea: 0,
      lastSaved: '',
      circles: puzzleData.circles
    },

    computed: {
      length() {
        return this.grid.length
      },

      direction() {
        return this.isVertical ? 'down' : 'across'
      },

      gridStyle() {
        return {
          display: 'grid',
          'grid-template-columns': `repeat(${this.colN}, 1fr [col-start])`,
          'grid-auto-rows': '1fr'
        }
      },
      entryFontSize() {
        let max = Math.max(this.rowN, this.colN)
        return `${420 / max}px`
      },

      entryStyle() {
        return { 'font-size': this.entryFontSize }
      },

      numberStyle() {
        let max = Math.max(this.rowN, this.colN)
        return { 'font-size': max > 10 ? '10px' : '14px' }
      },

      clueNumbers() {
        let numbs = { across: [], down: [] }
        this.gridnums.map((number, idx) => {
          if (this.isNumberedCell(idx)) {
            if (this.lookLeft(idx)) {
              numbs.across.push(number)
            }
            if (this.lookUp(idx)) {
              numbs.down.push(number)
            }
          }
        })
        return numbs
      },

      currentClue: {
        get() {
          const direction = this.direction
          const number = this.gridnums[this.highlighted[0]]
          return this.clues[direction][number]
        },
        set(newValue) {
          const direction = this.direction
          const number = this.gridnums[this.highlighted[0]]
          this.clues[direction][number] = newValue.replace(/\n/g, ' ')
        }
      },

      gridnums() {
        let returnArr = []
        let count = 0
        for (let i = 0; i < this.length; i++) {
          if (this.isNumberedCell(i)) {
            count += 1
            returnArr.push(count)
          }
          else {
            returnArr.push(0)
          }
        }
        return returnArr
      },

      highlighted() {
        return this.getInterval(this.activeCell, this.direction)
      },

      answers() {
        let answers = {}
        answers.across = this.clueNumbers.across.map((num) => {
          let idx = this.gridnums.indexOf(num)
          return this.getInterval(idx, "across")
            .map((index) => {
              return this.grid[index]
            })
            .join("")
        })
        answers.down = this.clueNumbers.down.map((num) => {
          let idx = this.gridnums.indexOf(num)
          return this.getInterval(idx, "down")
            .map((index) => {
              return this.grid[index]
            })
            .join("")
        })
        return answers
      },

      stats() {
        let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
        let nonEmptyAns = {
          across: this.answers.across.filter(word => word.length > 0),
          down: this.answers.down.filter(word => word.length > 0)
        }
        let stats = {}
        stats.blocks = this.grid.reduce((acc, curr) => acc += curr === BLACK ? 1 : 0, 0)
        stats.rebus = this.grid.reduce((acc, curr) => acc += curr.length > 1 ? 1 : 0, 0)
        stats.circles = this.circles.reduce((acc, curr) => acc + curr, 0)
        stats.wc = { across: nonEmptyAns.across.length, down: nonEmptyAns.down.length }
        let noAnswers = stats.wc.across === 0 && stats.wc.down === 0
        if (!noAnswers) {
          let avgNum = nonEmptyAns.across.reduce((acc, curr) => acc + curr.length, 0)
            + nonEmptyAns.across.reduce((acc, curr) => acc + curr.length, 0)
          stats.avg = (avgNum / (stats.wc.across + stats.wc.down)).toFixed(2)
        }
        else {
          stats.avg = 'NaN'
        }
        stats.distribution = {}
        alphabet.map(letter => {
          stats.distribution[letter] = this.grid.reduce((acc, curr) => acc += curr === letter ? 1 : 0, 0)
        })
        stats.coverage = alphabet.reduce((acc, curr) => acc += stats.distribution[curr] > 0 ? 1 : 0, 0)
        stats.missing = alphabet.filter(l => stats.distribution[l] === 0)

        return stats
      },

      chartData() {
        return {
          labels: Object.entries(this.stats.distribution), //'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
          datasets: [{
            label: 'Letter Distribution',
            data: Object.values(this.stats.distribution),
            backgroundColor: 'rgba(18, 105, 163, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            hoverBackgroundColor: 'rgba(18, 105, 163, 0.6)',
            borderWidth: 1
          }]
        }
      }
    },

    methods: {
      exportJSON() {
        let grid = this.grid
        let gridnums = this.gridnums
        let size = {
          cols: this.colN,
          rows: this.rowN
        }
        let clues = {
          across: [],
          down: []
        }
        for (let dir of ['across', 'down']) {
          this.clueNumbers[dir].map((number) => {
            let clue = this.clues[dir][number]
            let exportClue = `${number}. ${clue}`
            clues[dir].push(exportClue)
          })
        }
        let title = this.title
        let author = this.author
        let notepad = this.description
        let date = new Date().toJSON()
        let answers = this.answers
        let circles = this.circles.includes(1) ? this.circles : null
        return JSON.stringify({ title, author, notepad, date, grid, gridnums, size, clues, answers, circles })
      },

      getInterval(idx, dir) {
        let returnArr = []
        if (this.grid[idx] === BLACK) {
          return returnArr
        }
        let start = idx
        let stop = idx
        let inc = (dir === 'down') ? this.colN : 1
        if (dir === 'down') {
          while (!this.lookUp(start)) {
            start -= inc
          }
          while (!this.lookDown(stop)) {
            stop += inc
          }
        }
        else {
          while (!this.lookLeft(start)) {
            start -= inc
          }
          while (!this.lookRight(stop)) {
            stop += inc
          }
        }
        for (let i = start; i <= stop; i += inc) {
          returnArr.push(i)
        }
        return returnArr
      },

      getNumberInterval(dir) {
        return this.getInterval(this.activeCell, dir).map(i => this.gridnums[i])
      },

      handleCellClick(idx) {
        if (event.altKey && event.shiftKey) {
          this.activeCell = idx
          this.rebusHandler(event, idx, clicked = true)
        }
        else if (event.altKey) {
          this.activeCell = idx
          this.updateCircles(this.activeCell)
        }
        else {
          if (this.activeCell === idx) {
            this.toggleVertical()
          }
          this.activeCell = idx;
        }
      },

      rebusHandler(event, idx, clicked = false) {
        let rebusCell = document.createElement('input', { type: 'text' })
        rebusCell.classList.add('active-rebus')
        rebusCell.id = 'rebus-input'
        let cell = clicked ? event.target.closest('.cell') : document.querySelector('.cell.active')
        cell.appendChild(rebusCell)
        let max = Math.max(this.rowN, this.colN)
        rebusCell.style = `font-size:${this.entryFontSize}; height:${525 / max}px`
        rebusCell.focus()
        rebusCell.value = this.grid[idx]
        rebusCell.style.width = `${rebusCell.value.length + 3}rem`
        rebusCell.setAttribute('onkeypress', "this.style.width = (this.value.length + 3) + 'rem';")
        rebusCell.addEventListener('keydown', (e) => {
          if (e.key.toUpperCase() === 'ENTER') {
            let value = rebusCell.value.toUpperCase()
            this.updateGrid(idx, value)
            rebusCell.remove()
          }
        })
        rebusCell.addEventListener('focusout', (e) => {
          rebusCell.remove()
        })
      },

      handleClueClick(number, clueType) {
        console.log('hi')
        if (clueType !== this.direction) {
          this.toggleVertical()
        }
        const idx = this.gridnums.indexOf(Number(number))
        this.activeCell = idx
        document.querySelector('#clue-input').focus()
      },

      prepareSaveData() {
        let grid = this.grid
        let clues = {
          across: {},
          down: {}
        }
        for (let dir of ['across', 'down']) {
          this.clueNumbers[dir].map((number) => {
            clues[dir][String(number)] = this.clues[dir][number]
          })
        }
        let size = { rowN: this.rowN, colN: this.colN }
        let title = this.title ? this.title : 'untitled'
        let description = this.description
        let symmetry = this.symmetry
        let author = this.author
        let gridnums = this.gridnums
        let answers = this.answers
        let circles = this.circles
        let pk = puzzlePK
        return { grid, gridnums, clues, size, title, description, author, answers, symmetry, circles, pk }
      },

      savePuzzle() {
        saveData = this.prepareSaveData(puzzleData)
        return fetch(`/save/`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(saveData)
        })
          .then(response => response.json())
          .then(jsonResp => {
            console.log(jsonResp.message)
            let dt = new Date()
            this.lastSaved = { date: dt.toLocaleDateString(), time: dt.toLocaleTimeString() }
          })
      },

      editPuzzle() {
        saveData = this.prepareSaveData(puzzleData)
        return fetch(`/toggle-complete/?pk=${puzzlePK}`
        )
          .then(resp => resp.json())
          .then(jsonData => {
            if (jsonData.redirect === true) {
              window.location.replace(`/edit/${puzzlePK}`)
            }
          })
      },

      markComplete() {
        saveData = this.prepareSaveData(puzzleData)
        return fetch(`/toggle-complete/`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(saveData)
        })
          .then(resp => resp.json())
          .then(jsonData => {
            if (jsonData.redirect === true) {
              window.location.replace("/")
            }
          })
      },

      arrayToCoor(idx) {
        return { row: Math.floor(idx / this.colN), col: idx % this.colN }
      },
      coorToArray(row, col) {
        return row * this.colN + col
      },

      computeSymmetry(idx) {
        let row = this.arrayToCoor(idx).row
        let col = this.arrayToCoor(idx).col
        let newRow = this.rowN - row - 1
        let newCol = this.colN - col - 1
        switch (this.symmetry) {
          case "rotational":
            return this.coorToArray(newRow, newCol)
            break
          case "vertical":
            return this.coorToArray(row, newCol)
            break
          case "horizontal":
            return this.coorToArray(newRow, col)
            break
          case "none":
            return this.activeCell
            break
        }
      },

      applySymmetry(idx, value) {
        if (this.grid[idx] === BLACK) {
          this.updateGrid(this.computeSymmetry(idx), value)
        }
      },

      updateGrid(idx, value) {
        // note: splice works when idx < 0, like in Python
        if (value === BLACK && this.circles[idx] === 1) {
          this.updateCircles(idx)
        }
        this.grid.splice(idx, 1, value)
      },

      updateCircles(idx) {
        if (this.grid[idx] !== BLACK) {
          let current = this.circles[idx]
          let newValue = (current + 1) % 2 // toggle between 0 and 1
          this.circles.splice(idx, 1, newValue)
        }
      },

      toggleVertical() {
        this.isVertical = !this.isVertical
      },

      isNumberedCell(idx) {
        if (this.grid[idx] === BLACK) {
          return false
        }
        return this.lookUp(idx) || this.lookLeft(idx)
      },

      lookUp(idx) {
        // return true if idx is in row 1 or is below black square
        return (idx < this.colN) || (this.grid[idx - this.colN] === BLACK)
      },
      lookDown(idx) {
        // return true if idx is in row 1 or is below black square
        return (idx >= this.length - this.colN) || (this.grid[idx + this.colN] === BLACK)
      },
      lookLeft(idx) {
        // return true if idx is in column 1 or to the right of a black square
        return (idx % this.colN === 0) || (this.grid[idx - 1] === BLACK)
      },
      lookRight(idx) {
        // return true if idx is in column 1 or to the right of a black square
        return (idx % this.colN === this.colN - 1) || (this.grid[idx + 1] === BLACK)
      },

      nextCell() {
        if (!this.isVertical) {
          if (this.activeCell < this.length - 1) {
            this.activeCell = this.activeCell + 1
          }
        }
        else {
          this.activeCell += (this.activeCell + this.colN < this.length) ? this.colN : 0
        }
      },

      prevCell() {
        if (!this.isVertical) {
          if (this.activeCell > 0) {
            this.activeCell = this.activeCell - 1
          }
        }
        else {
          this.activeCell -= (this.activeCell - this.colN >= 0) ? this.colN : 0
        }
      },

      jumpWord(dir) {
        // dir should be 1 to jump to next word, or -1 for previous word
        if (this.grid[this.activeCell] === BLACK) {
          while (this.grid[this.activeCell] === BLACK) {
            this.activeCell += dir
          }
        }
        else {
          let numberArray = this.clueNumbers[this.direction]
          let currentNumber = this.gridnums[this.highlighted[0]]
          let currentNumberIdx = numberArray.indexOf(currentNumber)
          let nextNumberIdx = mod(currentNumberIdx + dir, numberArray.length)
          let nextNumber = numberArray[nextNumberIdx]
          this.activeCell = this.gridnums.indexOf(nextNumber)
        }
      },

      keyhandle(event) {
        const key = event.key.toUpperCase()
        let modifierPressed = event.metaKey || event.ctrlKey || event.altKey
        const validEntries = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ.*@#$%&+?'
        const validKeys = ['ARROWUP', 'ARROWDOWN', 'ARROWLEFT', 'ARROWRIGHT', 'BACKSPACE', 'DELETE', 'ENTER', 'HOME', 'END', ' ']
        if (validEntries.includes(key) && !modifierPressed && !this.completed) {
          if (this.grid[this.activeCell] === BLACK) {
            let symmetricEntry = key === BLACK ? BLACK : ''
            this.applySymmetry(this.activeCell, symmetricEntry)
            this.updateGrid(this.activeCell, key)
          }
          else {
            this.updateGrid(this.activeCell, key)
            this.applySymmetry(this.activeCell, BLACK)
          }
          this.nextCell()
        }
        else if (validKeys.includes(key)) {
          event.preventDefault()
          this.nonAlphaKeys(key)
        }
      },

      nonAlphaKeys(key) {
        if (key === 'DELETE') {
          if (this.grid[this.activeCell] === BLACK) {
            this.applySymmetry(this.activeCell, '')
          }
          this.updateGrid(this.activeCell, '')
        }
        else if (key === 'BACKSPACE') {
          if (this.grid[this.activeCell] === '') {
            this.prevCell()
            if (this.grid[this.activeCell] === BLACK) {
              this.applySymmetry(this.activeCell, '')
            }
            this.updateGrid(this.activeCell, '')
          }
          else {
            if (this.grid[this.activeCell] === BLACK) {
              this.applySymmetry(this.activeCell, '')
            }
            this.updateGrid(this.activeCell, '')
          }
        }
        else if (key === 'ENTER') {
          if (event.shiftKey && event.altKey) {
            this.rebusHandler(event, this.activeCell)
          }
          else if (event.altKey) {
            this.updateCircles(this.activeCell)
          }
          else if (event.shiftKey) {
            this.jumpWord(-1)
          }
          else {
            this.jumpWord(1)
          }
        }
        else if (key === ' ') {
          this.toggleVertical()
        }
        else if (key === "ARROWRIGHT") {
          if (this.isVertical) {
            this.toggleVertical()
          }
          else {
            this.nextCell()
          }
        }
        else if (key === "ARROWLEFT") {
          if (this.isVertical) {
            this.toggleVertical()
          }
          else {
            this.prevCell()
          }
        }
        else if (key === "ARROWDOWN") {
          if (!this.isVertical) {
            this.toggleVertical()
          }
          else {
            this.nextCell()
          }
        }
        else if (key === "ARROWUP") {
          if (!this.isVertical) {
            this.toggleVertical()
          }
          else {
            this.prevCell()
          }
        }
        else if (key === "HOME") {
          let coors = this.arrayToCoor(this.activeCell)
          if (!this.isVertical) {
            this.activeCell = this.coorToArray(coors.row, 0)
          }
          else {
            this.activeCell = this.coorToArray(0, coors.col)
          }
        }
        else if (key === "END") {
          let coors = this.arrayToCoor(this.activeCell)
          if (!this.isVertical) {
            this.activeCell = this.coorToArray(coors.row, this.colN - 1)
          }
          else {
            this.activeCell = this.coorToArray(this.rowN - 1, coors.col)
          }
        }
      }

    },

    created: function () {
      window.addEventListener('keydown', (event) => {
        let ignoreInputs = document.querySelectorAll('input')
        if (event.target.nodeName !== 'INPUT' && event.target.nodeName !== 'TEXTAREA') {
          this.keyhandle(event)
        }
      })
    }
  });
  // End Vue App

  // Non negative modulus function
  function mod(n, m) {
    return ((n % m) + m) % m;
  }


  const deleteButton = document.querySelector('#delete-btn')
  deleteButton.addEventListener('click', deleteEvent)
  function deleteEvent(event) {
    const result = confirm('Do you want to permanently delete this puzzle?')
    if (result) {
      return fetch(`/delete/${puzzlePK}/`, { method: 'DELETE' })
        .then((resp) => {
          return resp.json()
        })
        .then(jsonResp => {
          if (jsonResp.status === 'ok') {
            window.location.href = '/'
          }
          else {
            deleteButton.insertAdjacentHTML('afterend', `<div class="error">${jsonResp.message}</div>`)
          }
        })
    }
  }


  // === Export Handlers ===
  document.querySelector('#json-btn').addEventListener('click', (event) => {
    const jsn = editor.exportJSON()
    const data = new File([jsn], 'my_exported_puzzle.json', { type: 'application/json' })
    let url = window.URL.createObjectURL(data)
    let anchor = document.querySelector('#export-json')
    anchor.href = url
    editor.savePuzzle()
  })

  document.querySelector('#txt-v1-btn').addEventListener('click', (event) => {
    const txt = exportTXTv1()
    const data = new File([txt], 'across-lite-v1.txt', { type: 'text/plain' })
    let url = window.URL.createObjectURL(data)
    let anchor = document.querySelector('#export-txt-v1')
    anchor.href = url
    editor.savePuzzle()
  })

  document.querySelector('#txt-v2-btn').addEventListener('click', (event) => {
    const txt = exportTXTv2()
    const data = new File([txt], 'across-lite-v2.txt', { type: 'text/plain' })
    let url = window.URL.createObjectURL(data)
    let anchor = document.querySelector('#export-txt-v2')
    anchor.href = url
    editor.savePuzzle()
  })


  document.querySelector('#export-nytimes-pdf').addEventListener('submit', (event) => {
    event.preventDefault()
    let csrftoken = Cookies.get('csrftoken')
    let nytButton = document.querySelector('#nyt-btn')
    nytButton.textContent = 'Loading...'
    let addressInputs = document.querySelectorAll('#export-nytimes-pdf input')
    let formData = {}
    for (let inp of addressInputs) {
      formData[inp.id] = inp.value
    }
    return editor.savePuzzle()
      .then(r => {
        return fetch(`/export/${puzzlePK}/`, {
          method: 'POST',
          headers: {
            "X-CSRFToken": csrftoken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        })
          .then(resp => {
            nytButton.textContent = "Download"
            return resp.blob()
          })
      })
      .then(blob => {
        let url = window.URL.createObjectURL(blob)
        let a = document.createElement('a')
        a.href = url
        a.download = `${editor.title}_nyt_submit_format.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
  })

  function exportTXTv1() {
    let acrossString = ''
    for (let number of editor.clueNumbers.across) {
      acrossString += editor.clues.across[number] + '\n'
    }
    acrossString = acrossString.trimEnd()
    let downString = ''
    for (let number of editor.clueNumbers.down) {
      downString += editor.clues.down[number] + '\n'
    }
    downString = downString.trimEnd()
    let gridString = ''
    for (let i = 0; i < editor.rowN; i++) {
      let row = ''
      for (let j = 0; j < editor.colN; j++) {
        row += editor.grid[i * editor.colN + j][0]
      }
      gridString += row + '\n'
    }
    gridString = gridString.trimEnd()
    let returnString = `<ACROSS PUZZLE>
<TITLE>
${editor.title ? editor.title : ''}
<AUTHOR>
${editor.author ? editor.author : ''}
<COPYRIGHT>

<SIZE>
${editor.colN}x${editor.rowN}
<GRID>
${gridString}
<ACROSS>
${acrossString}
<DOWN>
${downString}
<NOTEPAD>${editor.description ? editor.description : ''}
`
    return returnString
  }

  /*
  * This format uses footnote style references between
  * the <grid> and <rebus> sections to indicate where
  * rebus entries belong.  Because the grid only holds slots for
  * single chars, and we're using digits as the placeholder,
  * this will only make sense for up to 10 _unique_ rebus entries.
  * The other option is to add some special characters as placeholders
  */
  function exportTXTv2() {
    let rebusList = []
    let grid = editor.grid
    grid.map((entry, i) => {
      if (entry.length > 1) {
        rebusList.push(entry)
      }
    })
    let rebusUniqueList = []
    for (let rebus of rebusList) {
      if (!rebusUniqueList.includes(rebus)) {
        rebusUniqueList.push(rebus)
      }
    }

    let markers = ''
    rebusUniqueList.map((rebus, i) => {
      markers += `${i}:${rebus}:${rebus[0]}\n`
    })
    markers.trimEnd()

    let marked = editor.circles.includes(1) ? '\nMARK;' : ''
    let rebusSection = `<REBUS>${marked}\n${markers}`

    let acrossString = ''
    for (let number of editor.clueNumbers.across) {
      acrossString += editor.clues.across[String(number)] + '\n'
    }
    acrossString = acrossString.trimEnd()
    let downString = ''
    for (let number of editor.clueNumbers.down) {
      downString += editor.clues.down[String(number)] + '\n'
    }
    downString = downString.trimEnd()

    let gridString = ''
    for (let i = 0; i < editor.rowN; i++) {
      let row = ''
      for (let j = 0; j < editor.colN; j++) {
        let idx = i * editor.colN + j
        let entry = grid[idx]
        if (entry.length === 0) {
          row += 'X'
        }
        else if (entry.length > 1) {
          row += rebusUniqueList.indexOf(entry)
        }
        else if (editor.circles[idx] === 1) {
          row += entry.toLowerCase()
        }
        else {
          row += entry
        }
      }
      gridString += row + '\n'
    }
    gridString = gridString.trimEnd()

    return `<ACROSS PUZZLE V2>
<TITLE>
  ${editor.title ? editor.title : ''}
<AUTHOR>
${editor.author ? editor.author : ''}
<COPYRIGHT>

<SIZE>
${editor.colN}x${editor.rowN}
<GRID>
${gridString}
${rebusList.length > 0 || marked ? rebusSection : ''}<ACROSS>
${acrossString}
<DOWN>
${downString}
<NOTEPAD>${editor.description ? '\n' + editor.description : ''}
`
  }
