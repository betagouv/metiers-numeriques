interface ServiceProps {
  fullName: string | null
  id: string
  legacyEntityId: string | null
  name: string
  region: string
  shortName: string | null
  url: string | null
}

export default class Service implements ServiceProps {
  public id: string

  public fullName: string | null
  public legacyEntityId: string | null
  public name: string
  public region: string
  public shortName: string | null
  public url: string | null

  constructor({ fullName, id, legacyEntityId, name, region, shortName, url }: ServiceProps) {
    this.fullName = fullName
    this.id = id
    this.legacyEntityId = legacyEntityId
    this.name = name
    this.region = region
    this.shortName = shortName
    this.url = url
  }
}
