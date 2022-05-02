import styled from 'styled-components'

import { Step } from './Step'

// eslint-disable-next-line @typescript-eslint/naming-convention
const Box = styled.div`
  margin: 0 0 1rem 1.5rem;
`

type StepBarProps = {
  activeStepKey: string | undefined
  steps: Array<{
    Icon: any
    key: string
    label: string
  }>
}
export function StepBar({ activeStepKey, steps }: StepBarProps) {
  const activetepIndex = steps.findIndex(({ key }) => key === activeStepKey)

  const stepsWithProps = steps.map(({ Icon, ...props }, index) => ({
    ...props,
    children: <Icon />,
    isActive: index === activetepIndex,
    isDone: index < activetepIndex,
  }))

  return (
    <Box>
      {stepsWithProps.map(({ key, ...props }) => (
        <Step key={key} {...props} />
      ))}
    </Box>
  )
}
