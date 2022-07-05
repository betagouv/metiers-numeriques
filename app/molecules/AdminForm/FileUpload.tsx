import { Loader } from '@app/molecules/Loader'
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

// TODO: export in SUI
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

export function FileUpload({ isDisabled = false, label, name }: FileUploadProps) {
  const { errors, isSubmitting, setFieldError, setFieldValue } = useFormikContext<any>()

  const inputRef = useRef<HTMLInputElement | null>(null)
  const { uploadToS3 } = useS3Upload()
  const [isUploadding, setIsUploading] = useState(false)
  const [uploadUrl, setUploadUrl] = useState<string>()

  const handleFileChange = async event => {
    setIsUploading(true)
    try {
      const file = event.target.files[0]
      const { url } = await uploadToS3(file)

      setFieldValue(name, url)
      setUploadUrl(url)
      setIsUploading(false)
    } catch (e) {
      setFieldError(name, `Une erreur est survenue lors du chargement: ${e}`)
    }
  }

  return (
    <Container>
      <Label>{label}</Label>
      {isUploadding && <Loader />}
      <Row>
        {!isUploadding && uploadUrl && <Thumbnail alt="uploaded file" src={uploadUrl} />}
        <input
          ref={inputRef}
          accept="image/*"
          name={name}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          type="file"
        />
        {!isUploadding && (
          <Button accent="primary" disabled={isDisabled || isSubmitting} onClick={() => inputRef.current?.click?.()}>
            {uploadUrl ? 'Editer' : 'Choisir un fichier'}
          </Button>
        )}
      </Row>
      {errors?.[name] && <Error>{errors[name]}</Error>}
    </Container>
  )
}
