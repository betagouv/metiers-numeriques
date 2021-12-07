interface EntityProps {
  fullName?: string
  id: string
  name: string
}

export default class Entity implements EntityProps {
  public fullName?: string
  public id: string
  public name: string

  constructor({ fullName, id, name }: EntityProps) {
    this.fullName = fullName
    this.id = id
    this.name = name
  }
}
