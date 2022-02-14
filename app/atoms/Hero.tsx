import Image from 'next/image'
import styled from 'styled-components'

import type { ReactNode } from 'react'

const OuterBox = styled.div`
  background: linear-gradient(to left, #00b4db, #0083b0);
`

const InnerBox = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  padding: 4rem 2rem;

  @media (min-width: 992px) {
    flex-direction: row;
    justify-content: space-between;
  }
  @media (min-width: 1400px) {
    padding: 4rem 0;
  }

  h1 {
    color: inherit;
    font-weight: 300;
  }

  p {
    font-size: 125%;
    font-weight: 300;
    line-height: 1.5;
  }
`

const TextBox = styled.div`
  text-align: center;

  @media (min-width: 992px) {
    max-width: 60%;
    text-align: left;
  }
`

const IllustrationBox = styled.div`
  margin-top: 4rem;
  min-height: 16rem;
  position: relative;

  @media (min-width: 992px) {
    margin-top: 0;
    min-height: 0;
    text-align: right;
    width: 40%;
  }
`

type MainHeaderProps = {
  children?: ReactNode
  illustrationPath?: string
  title: ReactNode
}

export function Hero({ children, illustrationPath, title }: MainHeaderProps) {
  return (
    <OuterBox>
      <div className="fr-container">
        <InnerBox>
          <TextBox className="fr-pr-2w">
            <h1>{title}</h1>

            {children}
          </TextBox>
          {illustrationPath && (
            <IllustrationBox>
              <Image alt={String(title)} layout="fill" objectFit="contain" src={illustrationPath} />
            </IllustrationBox>
          )}
        </InnerBox>
      </div>
    </OuterBox>
  )
}
