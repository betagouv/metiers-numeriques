/**
 * @see  https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination
 */
export default function buildPrismaPaginationFilter(perPage?: number, pageIndex?: number): any {
  if (perPage === undefined) {
    return {}
  }

  if (pageIndex === undefined) {
    return {
      take: perPage,
    }
  }

  const skip = pageIndex * perPage

  return {
    skip,
    take: perPage,
  }
}
