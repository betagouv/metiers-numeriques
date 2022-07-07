import { theme } from '@app/theme'
import React, { useState } from 'react'
import styled from 'styled-components'

const TabContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow-y: auto;

  @media screen and (max-width: 767px) {
    padding: 0 1rem;
    margin: 2rem -1.5rem;
  }
`

const Tab = styled.div<{ selected?: boolean }>`
  padding: 0.5rem 1rem;
  color: ${p => (p.selected ? theme.color.primary.darkBlue : 'inherit')};
  border-bottom: ${p =>
    p.selected ? `2px solid ${theme.color.primary.darkBlue}` : `1px solid ${theme.color.neutral.greyBlue}`};
  font-size: 1.125rem;
  line-height: 1.5rem;
  cursor: pointer;
`

type TabProps = {
  key: string
  label: string
  onClick: () => void
}

type TabMenuProps = { tabs: TabProps[] }

export const TabMenu = ({ tabs }: TabMenuProps) => {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0)

  const handleClick = (tab: TabProps, index: number) => {
    setCurrentTabIndex(index)
    tab.onClick()
  }

  return (
    <TabContainer>
      {tabs.map((tab, index) => (
        <Tab key={tab.label} onClick={() => handleClick(tab, index)} selected={index === currentTabIndex}>
          {tab.label}
        </Tab>
      ))}
    </TabContainer>
  )
}
