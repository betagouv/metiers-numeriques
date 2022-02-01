import handleError from '@common/helpers/handleError'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import capitalizeFirstLetter from './capitalizeFirstLetter'

import 'dayjs/locale/fr'

dayjs.extend(relativeTime)
dayjs.locale('fr')

export default function humanizeDate(isoDate: string): string {
  try {
    if (typeof isoDate !== 'string' || !dayjs(isoDate).isValid()) {
      return ''
    }

    return capitalizeFirstLetter(dayjs(isoDate).fromNow())
  } catch (err) /* istanbul ignore next */ {
    handleError(err, 'app/helpers/humanizeDate()')

    return ''
  }
}
