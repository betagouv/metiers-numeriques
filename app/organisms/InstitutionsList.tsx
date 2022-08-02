import { InstitutionCard } from '@app/organisms/InstitutionCard'
import { Institution } from '@prisma/client'
import styled from 'styled-components'

const Box = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 1rem 0 3rem;
`

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: flex-start;
  width: 100%;

  @media screen and (max-width: 767px) {
    > .InstitutionCard {
      width: 100%;
    }
  }

  @media screen and (min-width: 768px) {
    > .InstitutionCard {
      width: calc((100% - 4rem) / 3);
      max-width: calc((100% - 4rem) / 3);
    }
  }
`

type InstitutionsListProps = {
  institutions: Institution[]
}
export function InstitutionsList({ institutions }: InstitutionsListProps) {
  return (
    <Box>
      <List>
        {institutions.map(institution => (
          <InstitutionCard key={institution.id} institution={institution} />
        ))}
      </List>
    </Box>
  )
}
