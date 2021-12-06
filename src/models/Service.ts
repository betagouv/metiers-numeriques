import Institution from './Institution'

interface ServiceProps {
  fullName?: string
  id: string
  institution?: Institution
  name: string
  region: string
  url?: string
}

export default class Service implements ServiceProps {
  public fullName?: string
  public id: string
  public institution?: Institution
  public name: string
  public region: string
  public url?: string

  constructor({ fullName, id, institution, name, region, url }: ServiceProps) {
    this.fullName = fullName
    this.id = id
    this.institution = institution
    this.name = name
    this.region = region
    this.url = url
  }
}
