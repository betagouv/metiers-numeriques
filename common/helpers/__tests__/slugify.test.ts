import { slugify } from '../slugify'

describe('app/helpers/slugify()', () => {
  test(`with 'Administrateur/ Administratrice "outils de gestion de sollicitations et de connaissance"'`, () => {
    const text = 'Administrateur/ Administratrice "outils de gestion de sollicitations et de connaissance"'

    const result = slugify(text)
    expect(result).toEqual('administrateur-administratrice-outils-de-gestion-de-sollicitations-et-de-connaissance')
  })

  test(`with 'Chargé.e de conception et de développement`, () => {
    const text = 'Chargé.e de conception et de développement'

    const result = slugify(text)
    expect(result).toEqual('charge-e-de-conception-et-de-developpement')
  })

  test(`with 'Épatant`, () => {
    const text = 'Épatant'

    const result = slugify(text)
    expect(result).toEqual('epatant')
  })

  test(`with an id`, () => {
    const text = 'A text'
    const id = '42'

    const result = slugify(text, id)
    expect(result).toEqual('a-text-42')
  })
})
