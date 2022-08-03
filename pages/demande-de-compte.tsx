import { Spacer } from '@app/atoms/Spacer'
import { Title } from '@app/atoms/Title'
import { Form } from '@app/molecules/Form'
import { ActionBar } from '@app/organisms/Profile/ActionBar'
import { theme } from '@app/theme'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import styled from 'styled-components'
import * as Yup from 'yup'

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const SideBar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: ${theme.color.primary.darkBlue};
  width: 300px;
`

const FormSchema = Yup.object().shape({
  requestedInstitution: Yup.string().required('Ce champ est obligatoire'),
  requestedService: Yup.string().required('Ce champ est obligatoire'),
})

export default function ProfilePage() {
  const router = useRouter()

  const handleSubmit = async values => {
    await fetch('/api/auth/request-access', { body: JSON.stringify(values), method: 'POST' })
    router.push('/')
  }

  return (
    <div className="fr-container fr-pt-4w fr-pb-8w fr-grid-row">
      <SideBar className="fr-col-md-3 fr-displayed-md fr-p-4v">
        <Image height="200" layout="intrinsic" src="/images/rocket.svg" width="200" />
      </SideBar>
      <div className="fr-col-md-9 fr-col-12 fr-px-md-24v fr-py-md-6v">
        <PageContent>
          <Form initialValues={{}} onSubmit={handleSubmit} validationSchema={FormSchema}>
            <Title as="h1">Demande de compte recruteur</Title>
            <Spacer units={2} />
            <div>
              Vous souhaitez accéder à l&apos;espace recruteur du site ?<br /> Renseignez l&apos;institution et le
              service recruteur que vous souhaitez rejoindre, un administrateur vous donnera l&apos;accès dans les plus
              brefs délais.
            </div>
            <Spacer units={2} />
            <div className="fr-grid-row fr-mb-md-6v fr-mb-3v">
              <div className="fr-col-12">
                <Form.TextInput label="Mon Institution" name="requestedInstitution" />
              </div>
            </div>

            <div className="fr-grid-row fr-mb-md-6v fr-mb-3v">
              <div className="fr-col-12">
                <Form.TextInput label="Mon service recruteur" name="requestedService" />
              </div>
            </div>

            <ActionBar className="fr-pt-md-16v">
              <Form.Submit>Valider</Form.Submit>
            </ActionBar>
          </Form>
        </PageContent>
      </div>
    </div>
  )
}
