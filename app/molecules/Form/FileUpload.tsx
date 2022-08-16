import { useMutation } from '@apollo/client'
import { Button as AtomButton } from '@app/atoms/Button'
import { Loader } from '@app/molecules/Loader'
import { queries } from '@app/queries'
import { theme } from '@app/theme'
import { handleError } from '@common/helpers/handleError'
import { FileType } from '@prisma/client'
import { useField, useFormikContext } from 'formik'
import { useS3Upload } from 'next-s3-upload'
import { useRef, useState } from 'react'
import styled from 'styled-components'

const Label = styled.label`
  padding: 0 0 0.5rem 0;
  font-weight: 500;
`

const Filename = styled.div`
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 400px;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Button = styled(AtomButton)`
  width: 200px;
  height: 42px;
`

const Error = styled.span`
  margin-top: 8px;
  font-size: 80%;
  color: ${theme.color.danger.scarlet};
`

type FileUploadProps = {
  isDisabled?: boolean
  label: string
  name: string
}

/**
 * File Uploader for Formik & Prisma
 * @param isDisabled
 * @param label
 * @param name use the id field when using it (if the
 * @returns { type: string, url: string, title: string }
 *
 * Handles two formik values: `field` and `fieldId`
 * On your formik field, please use `field` and not `fieldId`
 * When Prisma returns an existing object, it hydrates both values
 * When a new picture is uploaded, it hydrates both values
 * When pushing to Prisma, you might need to strip the `field` from Formik values
 * before sending it to the backend, so you can use Prisma's UncheckedInput types:
 * ```
 *    R.omit(['field'])(formikValues)
 * ```
 * Otherwise, Prisma will raise a `"Unknown arg `field` in data.field for type MyObjectUnchecked(Create|Update)Input"`
 */
export function FileUpload({ isDisabled = false, label, name }: FileUploadProps) {
  const { isSubmitting, setFieldValue } = useFormikContext<any>()
  const [field, meta, helpers] = useField(name)

  const { uploadToS3 } = useS3Upload()
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [createFile] = useMutation(queries.file.CREATE_ONE)

  const filename = field.value?.title

  const handleFileChange = async event => {
    setIsUploading(true)
    try {
      const file = event.target.files[0]

      // Upload file to S3
      const { url } = await uploadToS3(file)

      // Create the file entry in the DB (for further a11y props)
      // TODO: Remove useless FileType
      const input = { title: file.name, type: FileType.EXTERNAL, url }
      const createFileResult = await createFile({
        variables: { input },
      })

      // Update both the field value and its ID field for Prisma
      helpers.setValue(input)
      setFieldValue(`${name}Id`, createFileResult.data.createFile.id)
    } catch (e) {
      handleError(e, 'app/molecules/AdminForm/FileUpload.tsx > handleFileChange()')
      helpers.setError(`Une erreur est survenue lors du chargement: ${e}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Container>
      <Label>{label}</Label>
      {isUploading && <Loader />}
      <Row>
        {!isUploading && filename && <Filename>{filename}</Filename>}
        <input ref={inputRef} name={name} onChange={handleFileChange} style={{ display: 'none' }} type="file" />
        {!isUploading && (
          <Button accent="primary" disabled={isDisabled || isSubmitting} onClick={() => inputRef.current?.click?.()}>
            {filename ? 'Editer' : 'Choisis un fichier'}
          </Button>
        )}
      </Row>
      {meta.touched && meta.error && <Error>{meta.error}</Error>}
    </Container>
  )
}
