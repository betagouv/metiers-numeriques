/**
 * @see  https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination
 */
export default function buildPrismaPaginationFilter(pageLength?: number, fromId?: string): any {
  if (pageLength === undefined) {
    return {}
  }

  if (fromId === undefined) {
    return {
      take: pageLength,
    }
  }

  return {
    cursor: {
      id: fromId,
    },
    skip: 1,
    take: pageLength,
  }
}
