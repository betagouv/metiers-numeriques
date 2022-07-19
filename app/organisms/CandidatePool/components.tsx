import styled from 'styled-components'

export const PageContainer = styled.div`
  height: 100vh;
  overflow: hidden;
`

export const ApplicationContainer = styled.div`
  padding: 1.5rem;
`

export const LoadingContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const ApplicationLetter = styled.p`
  white-space: pre-wrap;
`

export { ApplicationActions } from './ApplicationActions'
export { ApplicationHeader } from './ApplicationHeader'
export { ApplicationSubtitle } from './ApplicationSubtitle'
export { CandidatesList } from './CandidatesList'
export { CandidateInfos } from './CandidateInfos'
export { VivierActions } from './VivierActions'
export { CandidateTouchPoints } from './CandidateTouchPoints'
export { CandidateFilters } from './CandidateFilters'
export { FullHeightCard } from './FullHeightCard'
