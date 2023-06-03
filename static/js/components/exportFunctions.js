export function exportTXTv1(editor) {
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
export function exportTXTv2(editor) {
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
