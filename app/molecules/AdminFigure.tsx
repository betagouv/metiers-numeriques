import numeral from 'numeral'
import styled from 'styled-components'

import { AdminCard } from '../atoms/AdminCard'
import { Flex } from '../atoms/Flex'

const Box = styled.div`
  max-width: 20rem;
  padding-right: 1rem;
  width: 33.33%;
`

const Label = styled.h6`
  font-size: 100%;
  font-weight: 500;
`

const Value = styled.p`
  font-size: 150%;
  font-weight: 500;
`

type AdminFigureProps = {
  Icon: any
  label: string
  value?: number
}
export function AdminFigure({ Icon, label, value }: AdminFigureProps) {
  return (
    <Box>
      <AdminCard isFirst>
        <Flex>
          <div>
            <Label>{label}</Label>
            <Value>{value !== undefined ? numeral(value).format('0,0') : '…'}</Value>
          </div>
          <Icon />
        </Flex>
      </AdminCard>
    </Box>
  )
}
