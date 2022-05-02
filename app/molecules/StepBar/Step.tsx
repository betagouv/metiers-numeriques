import styled from 'styled-components'

export const Step = styled.div<{
  isActive: boolean
  isDone: boolean
  label: string
}>`
  background-color: ${p =>
    // eslint-disable-next-line no-nested-ternary
    p.isActive ? 'white' : p.isDone ? p.theme.color.success.default : p.theme.color.secondary.background};
  border: 0.25rem solid;
  border-color: ${p => (p.isActive ? p.theme.color.info.default : 'transparent')};
  border-radius: 50%;
  color: ${p => (p.isActive ? p.theme.color.info.default : 'white')};
  display: inline-block;
  height: 3rem;
  padding-top: 0.25rem;
  text-align: center;
  width: 3rem;

  :before {
    background: ${p =>
      // eslint-disable-next-line no-nested-ternary
      p.isActive
        ? `linear-gradient(to right, ${p.theme.color.success.default} 0%, ${p.theme.color.info.default} 100%)`
        : p.isDone
        ? p.theme.color.success.default
        : p.theme.color.secondary.background};
    content: '';
    display: block;
    height: 0.25rem;
  }

  :after {
    color: ${p =>
      // eslint-disable-next-line no-nested-ternary
      p.isActive
        ? p.theme.color.info.default
        : p.isDone
        ? p.theme.color.success.default
        : p.theme.color.secondary.default};
    content: '${p => p.label}';
    display: block;
    text-align: center;
    transform: translate(-1.75rem, 0.75rem);
    width: 6rem;
  }

  :first-child:before {
    background: none;
  }

  :nth-child(n + 2) {
    margin: 0 0 0 8rem;
  }
  :nth-child(n + 2):before {
    transform: translate(-7.25rem, 0.9rem);
    width: 6rem;
  }
`
