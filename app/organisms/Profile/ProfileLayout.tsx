import { theme } from '@app/theme'
import Image from 'next/image'
import React from 'react'
import styled from 'styled-components'

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const SideBar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: ${theme.color.primary.darkBlue};
  width: 300px;
`

export const ProfileLayout = ({ children }) => (
  <div className="fr-container fr-pt-4w fr-pb-8w fr-grid-row">
    <SideBar className="fr-col-md-3 fr-displayed-md fr-p-4v">
      <Image height="200" layout="intrinsic" src="/images/rocket.svg" width="200" />
    </SideBar>
    <div className="fr-col-md-9 fr-col-12 fr-px-md-24v fr-py-md-6v">
      <PageContent>{children}</PageContent>
    </div>
  </div>
)
