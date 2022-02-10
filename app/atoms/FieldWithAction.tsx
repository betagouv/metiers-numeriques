import MaterialAddCircleOutlined from '@singularity/core/icons/material/MaterialAddCircleOutlined'
import styled from 'styled-components'

const Box = styled.div`
  display: flex;

  > :first-child {
    flex-grow: 1;
  }
`

const IconBox = styled.div`
  display: flex;
  padding: 1.75rem 0 0 0.5rem;

  svg {
    align-self: flex-start;
    cursor: pointer;
    height: 2rem;
    width: 2rem;
  }
`

type FieldWithActionProps = {
  Icon?: any
  children: any
  onClick: () => void | Promise<void>
}

export function FieldWithAction({ children, Icon = MaterialAddCircleOutlined, onClick }: FieldWithActionProps) {
  return (
    <Box>
      {children}
      <IconBox>
        <Icon onClick={onClick} />
      </IconBox>
    </Box>
  )
}
