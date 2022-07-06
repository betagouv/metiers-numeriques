import { useMutation } from '@apollo/client'
import { Loader } from '@app/molecules/Loader'
import { queries } from '@app/queries'
import { FileType } from '@prisma/client'
import { Button as SUIButton } from '@singularity/core'
import { useFormikContext } from 'formik'
import { useS3Upload } from 'next-s3-upload'
import { useRef, useState } from 'react'
import styled from 'styled-components'

type FileUploadProps = {
  isDisabled?: boolean
  label: string
  name: string
}

const Label = styled.label`
  font-size: 80%;
  padding: 0 0 0.25rem 0;
  font-weight: 500;
  text-transform: uppercase;
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

const Button = styled(SUIButton)`
  width: 200px;
  height: 42px;
`

const Thumbnail = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 8px;
  margin-right: 24px;
`

const Error = styled.span`
  margin-top: 8px;
  font-size: 80%;
  color: ${p => p.theme.color.danger.default};
`

// TODO: export in SUI
// TODO: handle similar pictures posted
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
  const { errors, isSubmitting, setFieldError, setFieldValue, values } = useFormikContext<any>()

  const { uploadToS3 } = useS3Upload()
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [createFile] = useMutation(queries.file.CREATE_ONE)

  const uploadUrl = values?.[name]?.url

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
      setFieldValue(name, input)
      setFieldValue(`${name}Id`, createFileResult.data.createFile.id)

      setIsUploading(false)
    } catch (e) {
      setFieldError(name, `Une erreur est survenue lors du chargement: ${e}`)
    }
  }

  return (
    <Container>
      <Label>{label}</Label>
      {isUploading && <Loader />}
      <Row>
        {!isUploading && uploadUrl && <Thumbnail alt="uploaded file" src={uploadUrl} />}
        <input
          ref={inputRef}
          accept="image/*"
          name={name}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          type="file"
        />
        {!isUploading && (
          <Button accent="primary" disabled={isDisabled || isSubmitting} onClick={() => inputRef.current?.click?.()}>
            {uploadUrl ? 'Editer' : 'Choisir un fichier'}
          </Button>
        )}
      </Row>
      {errors?.[name] && <Error>{errors[name]}</Error>}
    </Container>
  )
}
