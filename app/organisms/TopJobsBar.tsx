import { LinkLikeButton } from '@app/atoms/LinkLikeButton'
import { Title } from '@app/atoms/Title'
import { JobCard, JobWithRelation } from '@app/organisms/JobCard'
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

  > .JobCard {
    width: 100%;
  }

  @media screen and (min-width: 768px) {
    flex-wrap: nowrap;
    justify-content: space-between;

    > .JobCard {
      width: 32%;
    }
  }
`

type TopJobsBarProps = {
  jobs: JobWithRelation[]
}
export function TopJobsBar({ jobs }: TopJobsBarProps) {
  return (
    <Box>
      <Title as="h2" isFirst>
        Nos offres de la semaine
      </Title>

      <List>
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </List>

      <LinkLikeButton accent="secondary" href="/offres-emploi">
        Toutes les offres
      </LinkLikeButton>
    </Box>
  )
}
