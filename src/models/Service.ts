import Entity from './Entity'

interface ServiceProps {
  entity?: Entity
  fullName?: string
  id: string
  name: string
  region: string
  shortName?: string
  url?: string
}

export default class Service implements ServiceProps {
  public fullName?: string
  public id: string
  public entity?: Entity
  public name: string
  public region: string
  public shortName?: string
  public url?: string

  constructor({ entity, fullName, id, name, region, shortName, url }: ServiceProps) {
    this.fullName = fullName
    this.id = id
    this.entity = entity
    this.name = name
    this.region = region
    this.shortName = shortName
    this.url = url
  }
}
