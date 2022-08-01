import { useField, useFormikContext } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const Label = styled.label`
  font-size: 80%;
  font-weight: 500;
  padding: 0 0 0.25rem 0;
  text-transform: uppercase;
`

type EditorProps = {
  helper?: string
  isDisabled?: boolean
  label: string
  name: string
  onBlur?: (values) => void
  placeholder: string
}

export function Editor({ helper, isDisabled = false, label, name, onBlur, placeholder }: EditorProps) {
  const [field, meta, helpers] = useField<string>(name)
  const { values } = useFormikContext<any>() // TODO: avoid using the full context on each field

  const editorRef = useRef<Record<string, unknown>>({})
  const [editorLoaded, setEditorLoaded] = useState(false)
  const { CKEditor, ClassicEditor } = editorRef.current || {}

  useEffect(() => {
    editorRef.current = {
      // eslint-disable-next-line global-require
      CKEditor: require('@ckeditor/ckeditor5-react').CKEditor, // v3+
      // eslint-disable-next-line global-require
      ClassicEditor: require('@ckeditor/ckeditor5-build-classic'),
    }
    setEditorLoaded(true)
  }, [])

  return (
    <div>
      {label && <Label htmlFor={name}>{label}</Label>}
      {editorLoaded ? (
        <CKEditor
          config={{
            toolbar: ['undo', 'redo', '|', 'heading', 'bold', 'italic', 'numberedList', 'bulletedList', 'link'],
          }}
          data={field.value || ''}
          disabled={isDisabled}
          editor={ClassicEditor}
          name={name}
          onBlur={() => onBlur?.(values)}
          onChange={(event, editor) => {
            const data = editor.getData()
            helpers.setValue(data)
          }}
          placeholder={placeholder} // TODO: placeholder doesn't work
        />
      ) : (
        <textarea disabled placeholder="Chargement..." />
      )}

      {meta.touched && meta.error && (
        <p className="fr-error-text" id={`${name}-error`}>
          {meta.error}
        </p>
      )}

      {helper && (
        <p className="fr-hint-text" id={`${name}-helper`}>
          {helper}
        </p>
      )}
    </div>
  )
}
