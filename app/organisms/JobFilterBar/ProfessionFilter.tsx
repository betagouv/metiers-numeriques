import { Select } from '@app/atoms/Select'
import * as R from 'ramda'
import { useCallback, useMemo } from 'react'

import type { SelectOption } from '@app/atoms/Select'
import type { Profession } from '@prisma/client'

type ProfessionFilterProps = {
  onChange: (professionId: string | undefined) => void | Promise<void>
  professions: Pick<Profession, 'id' | 'name'>[]
}
export function ProfessionFilter({ onChange, professions }: ProfessionFilterProps) {
  const options = useMemo(() => {
    const foundOthersProfession = R.find<Pick<Profession, 'id' | 'name'>>(R.propEq('name', 'Autres'))(professions)
    const sortedProfessions = foundOthersProfession
      ? [...R.reject(R.propEq('name', 'Autres'))(professions), foundOthersProfession]
      : professions

    return sortedProfessions.map(({ id, name }) => ({
      label: name,
      value: id,
    }))
  }, [professions])

  const handleChange = useCallback((professionAsOption: SelectOption | null) => {
    onChange(professionAsOption ? professionAsOption.value : undefined)
  }, [])

  return (
    <Select
      isClearable
      label="Filtrer par compétence"
      name="profession"
      onChange={handleChange as any}
      options={options}
    />
  )
}
