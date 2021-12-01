import daysjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import capitalizeFirstLetter from './capitalizeFirstLetter'
import handleError from './handleError'

import 'dayjs/locale/fr'

daysjs.extend(relativeTime)
daysjs.locale('fr')

export default function humanizeDate(isoDate: string): string {
  try {
    return capitalizeFirstLetter(daysjs(isoDate).fromNow())
  } catch (err) {
    handleError(err, 'helpers/humanizeDate()')
  }
}
