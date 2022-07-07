import { theme } from '@app/theme'
import React, { useState } from 'react'
import styled from 'styled-components'

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
    <div className="fr-grid-row fr-pb-12v fr-pt-16v">
      {tabs.map((tab, index) => (
        <Tab key={tab.label} onClick={() => handleClick(tab, index)} selected={index === currentTabIndex}>
          {tab.label}
        </Tab>
      ))}
    </div>
  )
}
