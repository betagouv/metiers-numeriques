import outputTypeFromNotionDatabase from '../helpers/outputTypeFromNotionDatabase'

async function guessNotionDabaseType() {
  const databaseId = process.argv[2]

  await outputTypeFromNotionDatabase(databaseId)
}

guessNotionDabaseType()
