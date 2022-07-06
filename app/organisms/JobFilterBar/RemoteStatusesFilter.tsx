import { Select } from '@app/atoms/Select'
import { JOB_REMOTE_STATUSES_AS_OPTIONS } from '@common/constants'
import * as R from 'ramda'
import { useCallback } from 'react'

import type { SelectOption } from '@app/atoms/Select'
import type { JobRemoteStatus } from '@prisma/client'

type RemoteStatusesFilterProps = {
  onChange: (remoteStatuses: JobRemoteStatus[]) => void | Promise<void>
}
export function RemoteStatusesFilter({ onChange }: RemoteStatusesFilterProps) {
  const handleChange = useCallback((remoteStatusesAsOptions: Array<SelectOption<JobRemoteStatus>>) => {
    const remoteStatuses = remoteStatusesAsOptions.map(R.prop('value'))

    onChange(remoteStatuses)
  }, [])

  return (
    <Select
      isClearable
      isMulti
      label="Télétravail accepté"
      name="remoteStatus"
      onChange={handleChange as any}
      options={JOB_REMOTE_STATUSES_AS_OPTIONS}
    />
  )
}
