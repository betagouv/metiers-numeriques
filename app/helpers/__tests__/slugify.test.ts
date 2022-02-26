/**
 * @jest-environment jsdom
 */

import { slugify } from '../slugify'

describe('app/helpers/slugify()', () => {
  test(`with "(Dgddi-dnsce) - Développeur Java Angular (Cat. A) H/f"`, () => {
    const text = '(Dgddi-dnsce) - Développeur Java Angular (Cat. A) H/f @'

    const result = slugify(text)

    expect(result).toEqual('dgddi-dnsce-developpeur-java-angular-cat-a-h-f')
  })
})
