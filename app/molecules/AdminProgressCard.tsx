import generateKeyFromValue from '@app/helpers/generateKeyFromValue'
import { Card } from '@singularity/core'
import { Flex } from 'reflexbox'
import styled from 'styled-components'

export const StyledCard = styled(Card)`
  margin: 0 0 ${p => p.theme.padding.layout.small} 0;
  max-width: 100%;

  @media screen and (min-width: 768px) {
    margin: 0 ${p => p.theme.padding.layout.small} ${p => p.theme.padding.layout.small} 0;
    max-width: 50%;

    :nth-child(even) {
      margin: 0 0 ${p => p.theme.padding.layout.small} 0;
    }
  }

  @media screen and (min-width: 1200px) {
    margin: 0 ${p => p.theme.padding.layout.small} ${p => p.theme.padding.layout.small} 0;
    max-width: 33.33%;

    :nth-child(3n) {
      margin: 0 0 ${p => p.theme.padding.layout.small} 0;
    }
  }

  @media screen and (min-width: 1400px) {
    margin: 0 ${p => p.theme.padding.layout.small} ${p => p.theme.padding.layout.small} 0;
    max-width: 25%;

    :nth-child(4n) {
      margin: 0 0 ${p => p.theme.padding.layout.small} 0;
    }
  }

  span {
    font-size: 90%;
    font-weight: 500;
  }
`

const Title = styled.h2`
  color: ${p => p.theme.color.body.dark};
  font-size: 120%;
  font-weight: 500;
`

const Progress = styled.div`
  background-color: ${p => p.theme.color.primary.background};
  border-radius: ${p => p.theme.appearance.borderRadius.medium};
  height: 0.5rem;
  margin: 0.25rem 0 0;
`
const ProgressBar = styled.div<{
  percentage: number
}>`
  background-color: ${p => p.theme.color.primary.default};
  border-radius: ${p => p.theme.appearance.borderRadius.medium};
  height: 0.5rem;
  width: ${p => p.percentage}%;
`

export type AdminProgressCardDataProps = {
  count: number
  length: number
  title: string
}

type AdminProgressCardProps = {
  data: AdminProgressCardDataProps[]
  title: string
}

export const AdminProgressCard = ({ data, title }: AdminProgressCardProps) => (
  <StyledCard>
    <Title>{title}</Title>

    <Flex flexDirection="column">
      {data.length === 0 && <p>Chargement en cours…</p>}
      {data.length > 0 &&
        data.map(({ count, length, title }) => {
          const percentage = Math.round((100 * count) / length)

          return (
            <Flex key={generateKeyFromValue(title)} flexDirection="column" mt={3}>
              <Flex justifyContent="space-between">
                <span>{`${count}/${length} ${title}`}</span>
                <span>{percentage.toFixed(0)}%</span>
              </Flex>
              <Progress>
                <ProgressBar percentage={percentage} />
              </Progress>
            </Flex>
          )
        })}
    </Flex>
  </StyledCard>
)
