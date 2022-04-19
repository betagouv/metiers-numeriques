declare namespace Common {
  /**
   * Make this type nullable.
   */
  type Nullable<T> = T | null

  type BNS = boolean | number | string | null

  type FunctionLike<R = void | Promise<void>> = () => R

  type FunctionLike<R = void | Promise<void>> = () => R

  /**
   * Plain Old Javascript Object
   */
  type Pojo = Record<string, BNS | BNS[] | Pojo | Pojo[]>

  namespace Api {
    type ResponseBody<T = undefined> = ResponseBodyError | ResponseBodySuccess<T>

    type ResponseBodyError = {
      code: number
      hasError: true
      message: string
    }

    type ResponseBodySuccess<T = undefined> = {
      data: T
      hasError: false
    }
  }

  namespace App {
    type SelectOption<T = string> = {
      label: string
      value: T
    }
  }

  namespace Auth {
    import type { User as PrismaUser } from '@prisma/client'

    type User = Pick<PrismaUser, 'email' | 'firstName' | 'id' | 'institutionId' | 'lastName' | 'recruiterId' | 'role'>
  }

  /**
   * @see https://adresse.data.gouv.fr/api-doc/adresse
   * @see https://github.com/geocoders/geocodejson-spec/tree/master/draft
   */
  interface GeocodeJson {
    attribution: string
    features: GeocodeJsonFeature[]
    licence: string
    limit: number
    query: string
    type: string
    version: string
  }

  /**
   * @see https://adresse.data.gouv.fr/api-doc/adresse
   * @see https://github.com/geocoders/geocodejson-spec/tree/master/draft
   * @see https://github.com/BaseAdresseNationale/adresse.data.gouv.fr/blob/master/components/api-doc/api-adresse/doc.js
   */
  interface GeocodeJsonFeature {
    geometry: {
      coordinates: [number, number]
      type: 'Point'
    }
    properties: {
      city: string
      citycode: string
      context: string
      /** Nom de l’arrondissement (Paris / Lyon / Marseille) */
      district?: string
      /** Numéro avec indice de répétition éventuel (bis, ter, A, B) */
      housenumber?: string
      id: string
      importance: number
      /** Libellé complet de l’adresse */
      label: string
      /** Numéro éventuel et nom de voie ou lieu dit */
      name: string
      postcode: string
      score: number
      street?: string
      /**
       * @description
       * - `housenumber`: Numéro « à la plaque »
       * - `locality`: Lieu-dit
       * - `municipality`: Numéro « à la commune »
       * - `street`: Position « à la voie », placée approximativement au centre de celle-ci
       */
      type: 'housenumber' | 'locality' | 'municipality' | 'street'
      x: number
      y: number
    }
    type: 'Feature'
  }

  type Graphqled<T> = T & {
    __typename: string
  }
}
