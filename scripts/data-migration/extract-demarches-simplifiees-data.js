const fs = require('fs')
const pdfParse = require('pdf-parse')

function isDir(path) {
  try {
    if (!path.startsWith('dossier')) {
      return false
    }
    const stat = fs.lstatSync(`./${path}`)

    return stat.isDirectory()
  } catch (e) {
    // lstatSync throws an error if path doesn't exist
    return false
  }
}

function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

/**
 * Extract data from www.demarches-simplifiees.fr adhoc applications so they can be imported in MetNum DB
 * Data is downloaded as a full zip in demarches simplifiées' admin dashboard, then script is executed at the root of the unzipped folder.
 *
 * @returns `data.json` file formatted for MetNum DB
 */
const extractData = async () => {
  const applications = await Promise.all(
    fs
      .readdirSync('./')
      .filter(isDir)
      .map(async applicationDir => {
        const dirData = fs.readdirSync(`./${applicationDir}`)
        const exportPdf = dirData.find(element => element.endsWith('.pdf') && element.startsWith('export'))
        const parsedData = {}

        const parsedPdf = await pdfParse(`./${applicationDir}/${exportPdf}`)
        const lines = parsedPdf.text.split('\n')

        lines.forEach((line, index) => {
          if (line.startsWith('Nom:')) {
            parsedData.lastName = capitalize(line.split('Nom:')[1])

            return
          }
          if (line.startsWith('Prénom:')) {
            parsedData.firstName = capitalize(line.split('Prénom:')[1])

            return
          }
          if (line.startsWith('Email:')) {
            parsedData.email = line.split('Email:')[1].toLowerCase()

            return
          }
          if (line === 'Votre numéro de téléphone') {
            if (lines[index + 1] === 'Non communiqué') {
              return
            }
            parsedData.phone = lines[index + 1].replaceAll(' ', '')

            return
          }
          if (line === 'Quelle est votre situation actuelle ?') {
            parsedData.currentJob = lines[index + 1]

            return
          }
          if (line === 'Lien vers votre profil linkedIn') {
            parsedData.linkedInUrl = lines[index + 1]

            return
          }
          if (line === 'lien vers votre site web et/ou github et/ou portfolio') {
            const url = lines[index + 1]
            if (lines[index + 1] === 'Non communiqué') {
              return
            }
            if (url.includes('github.com')) {
              parsedData.githubUrl = url
            } else {
              parsedData.portfolioUrl = url.split(' ')[0]
            }

            return
          }
          if (line === 'Faisons connaissance ! Présentez-vous et dites-nous ce que vous cherchez') {
            const lastTextBlockIndex = lines.findIndex(
              line => line === 'Que recherchez-vous comme type de poste ou métier?',
            )
            parsedData.applicationLetter = lines.slice(index + 1, lastTextBlockIndex).join('\n')

            return
          }
          if (line === 'Souhaitez-vous que votre profil soit diffusé auprès des recruteurs du site') {
            parsedData.openToVivier = lines[index + 2]
          }
          if (line === 'Si besoin, merci de cocher la ou les institutions où vous ne souhaitez pas envoyer votre') {
            parsedData.hiddenFromInstitutions = lines[index + 2]
          }

          const cvDir = fs.readdirSync(`./${applicationDir}/pieces_justificatives`)
          const cvFileName = cvDir.find(dir => dir.includes('cv')) || cvDir[0]
          parsedData.cvFileName = cvFileName
          fs.copyFile(
            `./${applicationDir}/pieces_justificatives/${cvFileName}`,
            `./cvs/${cvFileName}`,
            fs.constants.COPYFILE_EXCL,
            console.log,
          )
        })

        return parsedData
      }),
  )

  return applications
}

extractData().then(apps => fs.writeFileSync('./data.json', JSON.stringify(apps), { flag: 'w+' }))
