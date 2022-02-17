import JsCookie from 'js-cookie'

const COOKIE_NAME = 'METIERS_NUMERIQUE_CONFIG'

export enum CookieKey {
  HAS_SUBSCRIBED_TO_NEWSLETTER = 'HAS_SUBSCRIBED_TO_NEWSLETTER',
}

class Cookie {
  public get(key: CookieKey): any | undefined {
    const maybeConfigAsJson = JsCookie.get(COOKIE_NAME)
    if (maybeConfigAsJson === undefined) {
      return
    }

    const maybeConfig = this.parse(maybeConfigAsJson)
    if (maybeConfig === undefined) {
      return
    }

    return maybeConfig[key]
  }

  public set(key: CookieKey, value: any): void {
    const maybeConfigAsJson = JsCookie.get(COOKIE_NAME)
    if (maybeConfigAsJson === undefined) {
      this.setFirst(key, value)

      return
    }

    const maybeConfig = this.parse(maybeConfigAsJson)
    if (maybeConfig === undefined) {
      this.setFirst(key, value)

      return
    }

    maybeConfig[key] = value
    const maybeConfigAsString = this.stringify({
      ...maybeConfig,
      [key]: value,
    })
    if (maybeConfigAsString === undefined) {
      this.setFirst(key, value)

      return
    }

    JsCookie.set(COOKIE_NAME, maybeConfigAsString)
  }

  private setFirst(key: CookieKey, value: any): void {
    const maybeConfigAsString = this.stringify({
      [key]: value,
    })
    if (maybeConfigAsString === undefined) {
      return
    }

    JsCookie.set(COOKIE_NAME, maybeConfigAsString)
  }

  private parse(valueAsJson: string): Record<string, any> | undefined {
    try {
      return JSON.parse(valueAsJson)
    } catch (err) {
      return undefined
    }
  }

  private stringify(value: any): string | undefined {
    try {
      return JSON.stringify(value)
    } catch (err) {
      return undefined
    }
  }
}

export const cookie = new Cookie()
