export function humanizeSeniority(seniorityInMonths: number): string {
  const seniorityInYears = Math.floor(seniorityInMonths / 12)

  switch (seniorityInYears) {
    case 0:
      return 'Ouvert aux débutant·es'

    case 1:
      return `${seniorityInYears} an`

    default:
      return `${seniorityInYears} ans`
  }
}
