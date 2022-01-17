import { useFormikContext } from 'formik'
import dynamic from 'next/dynamic'
import styled from 'styled-components'

// https://github.com/securingsincity/react-ace/issues/725#issuecomment-604996470
const ReactAce = dynamic(
  async () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _ReactAce = await import('react-ace')

    // prevent warning in console about misspelled props name.
    await import('ace-builds/src-min-noconflict/ext-language_tools')

    // import your theme/mode here. <AceEditor mode="javascript" theme="solarized_dark" />
    await import('ace-builds/src-min-noconflict/mode-javascript')
    await import('ace-builds/src-min-noconflict/theme-solarized_dark')

    // as @Holgrabus commented you can paste these file into your /public folder.
    // You will have to set basePath and setModuleUrl accordingly.
    const ace = await import('ace-builds/src-min-noconflict/ace')
    ace.config.set('basePath', 'https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/')
    ace.config.setModuleUrl(
      'ace/mode/javascript_worker',
      'https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/worker-javascript.js',
    )

    return _ReactAce
  },
  { ssr: false },
)

const Label = styled.label`
  display: block;
  font-size: ${p => Math.round(p.theme.typography.size.medium * 80)}%;
  font-weight: 500;
  padding: 0 0 ${p => p.theme.padding.layout.tiny} 0;
`

const Box = styled.div<{
  isDisabled: boolean
}>`
  background-color: ${p => (p.isDisabled ? p.theme.color.secondary.background : p.theme.color.body.white)};
  border: solid 1px ${p => p.theme.color.secondary.default};
  border-radius: ${p => p.theme.appearance.borderRadius.medium};
  font-family: inherit;
  font-size: ${p => p.theme.typography.size.medium * 100}%;
  font-weight: 400;
  padding: ${p => p.theme.padding.input.medium};
  transition-delay: 0s, 0s, 0s, 0s;
  transition-duration: 0.15s, 0.15s, 0.15s, 0.15s;
  transition-property: color, background-color, border-color, box-shadow;
  transition-timing-function: ease-in-out, ease-in-out, ease-in-out, ease-in-out;
  width: 100%;

  :focus-within {
    box-shadow: 0 0 0 1px ${p => p.theme.color.secondary.active};
  }

  :hover {
    border: solid 1px ${p => p.theme.color.secondary.active};
  }
`

type CodeProps = {
  isDisabled?: boolean
  label: string
  name: string
}
export function Code({ isDisabled = false, label, name }: CodeProps) {
  const { isSubmitting, setFieldValue, values } = useFormikContext<any>()

  const handleChange = (newValue: string): void => {
    try {
      // Try / catch to avoid updating value with any unparsable data
      if (Array.isArray(JSON.parse(newValue))) {
        setFieldValue(name, newValue)
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.debug(err)
    }
  }

  return (
    <>
      <Label>{label}</Label>
      <Box isDisabled={isDisabled || isSubmitting}>
        <ReactAce
          defaultValue={values[name]}
          highlightActiveLine={false}
          maxLines={10}
          minLines={5}
          mode="json"
          name="UNIQUE_ID_OF_DIV"
          onChange={handleChange}
          readOnly={isDisabled || isSubmitting}
          showGutter={false}
          showPrintMargin={false}
          style={{
            backgroundColor: 'transparent',
          }}
          theme="github"
        />
      </Box>
    </>
  )
}
