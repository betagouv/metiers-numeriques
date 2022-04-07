import handleError from '@common/helpers/handleError'

const MAX_PER_PAGE = 100

/**
 * @see  https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination
 */
export default function buildPrismaPaginationFilter(
  perPage: number,
  pageIndex: number,
  options: {
    noThrottle?: boolean
  } = {
    noThrottle: false,
  },
): {
  skip?: number
  take: number
} {
  try {
    const maxPerPage = options.noThrottle ? Infinity : MAX_PER_PAGE
    const safePerPage = Number.isInteger(perPage) && perPage >= 1 && perPage <= maxPerPage ? perPage : 1
    const safePageIndex = Number.isInteger(pageIndex) && pageIndex >= 0 && Number.isFinite(pageIndex) ? pageIndex : 0
    const skip = safePageIndex * safePerPage

    return {
      skip,
      take: safePerPage,
    }
  } catch (err) {
    handleError(err, 'api/helpers/buildPrismaPaginationFilter()')

    return {
      take: 1,
    }
  }
}
