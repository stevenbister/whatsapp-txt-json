const fs = require('fs')
const text = './WhatsApp Chat with Person.txt'

fs.readFile(text, 'utf-8', (err, data) => {
  if (err) throw err;

  const metaRegex = (/((\d{2})\/(\d{2})\/(\d{4})),\s(\d{2}):(\d{2})\s\-\s([a-z])\w+\:/gi)
  const dateRegex = (/((\d{2})\/(\d{2})\/(\d{4})),/g)
  const timeRegex = (/\s((\d{2}):(\d{2}))/g)
  const namePlusColonRegex = (/\s\-\s(([a-z])\w+)\:/gi)
  const newLines = (/(\r\n|\n|\r)/gm)

  // Remove the new lines so everything sits on one line
  // Then insert a new character we can split the text on
  // The $& inserts the matched substring, we then just append the character before it
  const formatLines = data => {
    return data
      .replace(newLines, '')
      .replace(metaRegex, '\r\n$&')
      // By including the spaces and characters outside of the group in the regext I can cut them out using the $n method on replace
      .replace(dateRegex, "$1\t")
      .replace(timeRegex, '$1\t')
      .replace(namePlusColonRegex, '$1\t')
  }

  // Add a tab to the end of each line
  const pushLinesIntoArray = lines => formatLines(lines).split('\r\n').map(line => line + '\t')

  // Split on the tab to turn lines into an array
  // Use filter to take the new empty item out of the array 
  const splitLinesOnTab = lines => lines.map(line => line.split('\t')).filter(line => line.splice(-1, 1))

  // Remove empty array at the start
  const dataArray = splitLinesOnTab(pushLinesIntoArray(data))
  dataArray.shift()

  // Pass each line of the array to an object
  const mapArrToObj = arr => arr.map((item, index) => {
    return obj = {
      id: index,
      meta: {
        date: item[0],
        time: item[1],
        name: item[2],
      },
      message: item[3].toString().trim(),
    }
  })

  const output = mapArrToObj(dataArray)

    // Write the created json to a file so we can access it later
    fs.writeFile('data.json', JSON.stringify(output), 'utf-8', (err) => {
      if (err) throw err;
  
      console.log('File saved')
    })
})
