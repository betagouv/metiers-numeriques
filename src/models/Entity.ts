interface EntityProps {
  fullName: string | null
  id: string
  logoUrl: string | null
  name: string
}

export default class Entity implements EntityProps {
  public fullName: string | null
  public id: string
  public logoUrl: string | null
  public name: string

  constructor({ fullName, id, logoUrl, name }: EntityProps) {
    this.fullName = fullName
    this.id = id
    this.logoUrl = logoUrl
    this.name = name
  }
}
