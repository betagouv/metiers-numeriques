import { LinkLikeButton } from '@app/atoms/LinkLikeButton'
import { Title } from '@app/atoms/Title'
import { theme } from '@app/theme'
import Image from 'next/image'
import styled from 'styled-components'

const Box = styled.div`
  align-items: center;
  background-color: ${theme.color.primary.darkBlue};
  color: ${theme.color.neutral.white};
  display: flex;
  justify-content: space-between;
  padding: 3rem 3rem 4rem;
  margin-bottom: 4rem;
`

const Content = styled.div`
  > h2 {
    color: ${theme.color.neutral.white};
  }

  @media screen and (min-width: 768px) {
    width: 50%;
  }
`

const Picture = styled.div`
  display: none;

  @media screen and (min-width: 768px) {
    display: flex;
    flex-grow: 1;
    justify-content: center;
    max-height: 22rem;
  }
`

const List = styled.ul`
  list-style: none;
  margin: 2rem 0 3rem;
  padding-left: 3rem;
`
const ListItem = styled.li`
  line-height: 1.25;
  margin-top: 1rem;
  position: relative;

  :before {
    background-image: url('/images/home-testimonial-hand.svg');
    background-repeat: no-repeat;
    background-size: cover;
    content: '';
    display: inline-block;
    height: 2rem;
    left: -3rem;
    position: absolute;
    top: 0.5rem;
    width: 2rem;
  }
`

export function TestimonialBar() {
  return (
    <Box>
      <Picture>
        <Image height="404" layout="intrinsic" src="/images/home-testimonial-illu.svg" width="292" />
      </Picture>

      <Content>
        <Title as="h2" isFirst>
          Pourquoi venir travailler
          <br />
          dans le public ?
        </Title>

        <List>
          <ListItem>
            Pour participer
            <br /> à des missions d’intérêt général variées
          </ListItem>
          <ListItem>
            Pour avoir de l’impact
            <br />
            auprès de tes co-citoyens et co-citoyennes
          </ListItem>
          <ListItem>
            Pour donner du sens à ton travail
            <br />
            en améliorant le service public chaque jour
          </ListItem>
        </List>

        <LinkLikeButton accent="tertiary" href="https://www.dailymotion.com/playlist/x74h65" isExternal>
          Découvrir les témoignages
        </LinkLikeButton>
      </Content>
    </Box>
  )
}
