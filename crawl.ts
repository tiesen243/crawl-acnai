import fs from 'fs'

const BASE_URL = 'http://localhost:3000/api/v1' // Change this if needed
const OUTPUT_FILE = 'operators.json'

async function fetchOperators() {
  try {
    // Fetch list of operators
    const response = await fetch(BASE_URL)
    if (!response.ok) throw new Error('Failed to fetch operators')
    const operators = await response.json()

    // Fetch details for each operator
    const operatorDetails = await Promise.all(
      operators.map(async (op) => {
        const detailsResponse = await fetch(op.url)
        if (!detailsResponse.ok) throw new Error(`Failed to fetch details for ${op.name}`)
        const details = await detailsResponse.json()
        return details
      }),
    )

    // Write to JSON file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(operatorDetails, null, 2))
    console.log(`Successfully written to ${OUTPUT_FILE}`)
  } catch (error) {
    console.error('Error:', error)
  }
}

fetchOperators()
