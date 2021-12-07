interface EntityProps {
  fullName?: string
  id: string
  logoUrl?: string
  name: string
}

export default class Entity implements EntityProps {
  public fullName?: string
  public id: string
  public logoUrl?: string
  public name: string

  constructor({ fullName, id, logoUrl, name }: EntityProps) {
    this.fullName = fullName
    this.id = id
    this.logoUrl = logoUrl
    this.name = name
  }
}
