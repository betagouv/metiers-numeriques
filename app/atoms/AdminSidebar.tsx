import styled from 'styled-components'

const AdminSidebar = styled.main`
  background-color: #293042;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  min-width: 16rem;
  padding: ${p => p.theme.padding.layout.medium};
  position: fixed;
`

export default AdminSidebar
