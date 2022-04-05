import styled from 'styled-components'

const Box = styled.div`
  text-align: center;
  width: 100%;
`

const Icon = styled.i`
  display: inline-block;
  font-size: 2em;
`

export function Loader() {
  return (
    <Box className="fr-my-4w">
      <Icon className="ri-loader-4-fill rotating" />
    </Box>
  )
}
