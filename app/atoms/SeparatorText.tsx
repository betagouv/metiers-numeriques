import styled from 'styled-components'

export const SeparatorText = styled.div`
  font-weight: 500;
  overflow: hidden;
  text-align: center;

  :before,
  :after {
    background-color: lightgray;
    content: '';
    display: inline-block;
    height: 1px;
    position: relative;
    vertical-align: middle;
    width: 50%;
  }

  :before {
    margin-left: -50%;
    right: 1em;
  }

  :after {
    margin-right: -50%;
    left: 1em;
  }
`
