import { useQuery } from '@apollo/client'
import { queries } from '@app/queries'
import { Profession } from '@prisma/client'

import { Select, SelectProps } from './Select'

type ProfessionSelectProps = Omit<SelectProps, 'options'>

export function ProfessionSelect({ isDisabled, ...props }: ProfessionSelectProps) {
  const { data, loading } = useQuery<
    {
      getProfessionsList: Profession[]
    },
    any
  >(queries.profession.GET_LIST)

  const options = data?.getProfessionsList?.map(profession => ({ label: profession.name, value: profession.id })) || []

  return (
    <Select
      {...props}
      // This key helps rerender the component once domains are fetched while keeping the form value displayed
      key={`professions_${loading ? 'loading' : 'ready'}`}
      isDisabled={isDisabled || loading}
      options={options}
    />
  )
}
