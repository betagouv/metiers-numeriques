import { Button } from '@app/atoms/Button'
import styled from 'styled-components'

const Box = styled.div`
  padding: 2rem 0;
`

const Table = styled.table`
  border-collapse: collapse;
  td,
  th {
    border: 1rem solid white;
  }
  tr:first-child td,
  tr:first-child th {
    border-top: 0;
  }
  tr:last-child td {
    border-bottom: 0;
  }
  tr td:first-child,
  tr th:first-child {
    border-left: 0;
  }
  tr td:last-child,
  tr th:last-child {
    border-right: 0;
  }

  td,
  th {
    text-align: left;
  }

  tbody > tr > th {
    vertical-align: top;
  }
`

export default function ThemePage() {
  return (
    <Box>
      <h1>Theme</h1>

      <h2>Standard buttons</h2>
      <Table>
        <thead>
          <tr>
            <td colSpan={2} />
            <th colSpan={3}>Primary</th>
            <th colSpan={3}>Secondary</th>
            <th colSpan={3}>Tertiary</th>
          </tr>
          <tr>
            <td colSpan={2} />
            <th scope="col">Default</th>
            <th scope="col">Loading</th>
            <th scope="col">Disabled</th>
            <th scope="col">Default</th>
            <th scope="col">Loading</th>
            <th scope="col">Disabled</th>
            <th scope="col">Default</th>
            <th scope="col">Loading</th>
            <th scope="col">Disabled</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th rowSpan={3} scope="row">
              Normal
            </th>
            <th scope="row">No icon</th>
            <td>
              <Button accent="primary" size="normal">
                Label
              </Button>
            </td>
            <td>
              <Button accent="primary" isLoading size="normal">
                Label
              </Button>
            </td>
            <td>
              <Button accent="primary" disabled size="normal">
                Label
              </Button>
            </td>
            <td>
              <Button accent="secondary" size="normal">
                Label
              </Button>
            </td>
            <td>
              <Button accent="secondary" isLoading size="normal">
                Label
              </Button>
            </td>
            <td>
              <Button accent="secondary" disabled size="normal">
                Label
              </Button>
            </td>
            <td>
              <Button accent="tertiary" size="normal">
                Label
              </Button>
            </td>
            <td>
              <Button accent="tertiary" isLoading size="normal">
                Label
              </Button>
            </td>
            <td>
              <Button accent="tertiary" disabled size="normal">
                Label
              </Button>
            </td>
          </tr>
          <tr>
            <th scope="row">Icon right</th>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <th scope="row">Icon left</th>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <th rowSpan={3} scope="row">
              Medium
            </th>
            <th scope="row">No icon</th>
            <td>
              <Button accent="primary" size="medium">
                Label
              </Button>
            </td>
            <td>
              <Button accent="primary" isLoading size="medium">
                Label
              </Button>
            </td>
            <td>
              <Button accent="primary" disabled size="medium">
                Label
              </Button>
            </td>
            <td>
              <Button accent="secondary" size="medium">
                Label
              </Button>
            </td>
            <td>
              <Button accent="secondary" isLoading size="medium">
                Label
              </Button>
            </td>
            <td>
              <Button accent="secondary" disabled size="medium">
                Label
              </Button>
            </td>
            <td>
              <Button accent="tertiary" size="medium">
                Label
              </Button>
            </td>
            <td>
              <Button accent="tertiary" isLoading size="medium">
                Label
              </Button>
            </td>
            <td>
              <Button accent="tertiary" disabled size="medium">
                Label
              </Button>
            </td>
          </tr>
          <tr>
            <th scope="row">Icon right</th>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <th scope="row">Icon left</th>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <th rowSpan={3} scope="row">
              Small
            </th>
            <th scope="row">No icon</th>
            <td>
              <Button accent="primary" size="small">
                Label
              </Button>
            </td>
            <td>
              <Button accent="primary" isLoading size="small">
                Label
              </Button>
            </td>
            <td>
              <Button accent="primary" disabled size="small">
                Label
              </Button>
            </td>
            <td>
              <Button accent="secondary" size="small">
                Label
              </Button>
            </td>
            <td>
              <Button accent="secondary" isLoading size="small">
                Label
              </Button>
            </td>
            <td>
              <Button accent="secondary" disabled size="small">
                Label
              </Button>
            </td>
            <td>
              <Button accent="tertiary" size="small">
                Label
              </Button>
            </td>
            <td>
              <Button accent="tertiary" isLoading size="small">
                Label
              </Button>
            </td>
            <td>
              <Button accent="tertiary" disabled size="small">
                Label
              </Button>
            </td>
          </tr>
          <tr>
            <th scope="row">Icon right</th>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
          <tr>
            <th scope="row">Icon left</th>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
        </tbody>
      </Table>
    </Box>
  )
}
