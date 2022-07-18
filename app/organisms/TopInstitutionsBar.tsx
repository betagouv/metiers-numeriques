import { Title } from '@app/atoms/Title'
import { InstitutionCard } from '@app/organisms/InstitutionCard'
import { Institution } from '@prisma/client'
import styled from 'styled-components'

const Box = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 1rem 0 6rem;
`

const List = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 1rem 0 3rem 0;

  > .InstitutionCard {
    width: 100%;
  }

  @media screen and (min-width: 768px) {
    flex-wrap: nowrap;
    justify-content: space-between;

    > .InstitutionCard {
      width: 32%;
      max-width: 32%;
    }
  }
`

type TopInstitutionsBarProps = {
  institutions: Institution[]
}
export function TopInstitutionsBar({ institutions }: TopInstitutionsBarProps) {
  return (
    <Box>
      <Title as="h2" isFirst>
        Les employeurs de la semaine
      </Title>

      <List>
        {institutions.map(institution => (
          <InstitutionCard key={institution.id} institution={institution} />
        ))}
      </List>

      {/* TODO: create "all institutions" page */}
      {/* <LinkLikeButton accent="secondary" href="/offres-emploi"> */}
      {/*  Tous les employeurs */}
      {/* </LinkLikeButton> */}
    </Box>
  )
}
