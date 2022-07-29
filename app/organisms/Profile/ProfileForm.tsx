/* eslint-disable sort-keys-fix/sort-keys-fix */
import { Spacer } from '@app/atoms/Spacer'
import { Title } from '@app/atoms/Title'
import { Form } from '@app/molecules/Form'
import { ActionBar } from '@app/organisms/Profile/ActionBar'
import { FormikValues } from 'formik'
import React from 'react'
import * as Yup from 'yup'

const FormSchema = Yup.object().shape({
  firstName: Yup.string().required('Ce champ est obligatoire'),
  lastName: Yup.string().required('Ce champ est obligatoire'),
  currentJob: Yup.string().required('Ce champ est obligatoire'),
  phone: Yup.string().nullable(),
  linkedInUrl: Yup.string().required('Ce champ est obligatoire'),
  seniorityInYears: Yup.number().required('Ce champ est obligatoire'),
  githubUrl: Yup.string().url('Cette URL est mal formatée.').nullable(),
  portfolioUrl: Yup.string().url('Cette URL est mal formatée.').nullable(),
})

type Props = {
  initialValues: FormikValues
  onNext: (values: FormikValues) => void
}

export const ProfileForm = ({ initialValues, onNext }: Props) => (
  <Form initialValues={initialValues} onSubmit={onNext} validationSchema={FormSchema}>
    <Title as="h1">Ton Profil 1/2</Title>
    <Spacer units={2} />
    <div className="fr-grid-row fr-grid-row--gutters fr-mb-md-6v fr-mb-3v">
      <div className="fr-col-md-6 fr-col-12">
        <Form.TextInput aria-label="Prénom" name="firstName" placeholder="Prénom" />
      </div>
      <div className="fr-col-md-6 fr-col-12">
        <Form.TextInput aria-label="Nom" name="lastName" placeholder="Nom" />
      </div>
    </div>

    <div className="fr-grid-row fr-grid-row--gutters fr-mb-md-6v fr-mb-3v">
      <div className="fr-col-md-6 fr-col-12">
        <div>Te contacter</div>
        <Form.TextInput aria-label="Téléphone" name="phone" placeholder="Numéro de téléphone" />
      </div>
      <div className="fr-col-md-6 fr-col-12 fr-mt-md-5v">
        <Form.TextInput aria-label="Profil LinkedIn" name="linkedInUrl" placeholder="Profil LinkedIn" />
      </div>
    </div>

    <div className="fr-grid-row fr-grid-row--gutters fr-mb-md-6v fr-mb-3v">
      <div className="fr-col-md-6 fr-col-12">
        <div>Ce que tu fais</div>
        <Form.TextInput aria-label="Métier" name="currentJob" placeholder="Métier" />
      </div>
      <div className="fr-col-md-6 fr-col-12 fr-mt-md-5v">
        <Form.TextInput
          aria-label="Années d'expérience"
          name="seniorityInYears"
          placeholder="Années d'expérience"
          type="number"
        />
      </div>
    </div>

    <div className="fr-grid-row fr-grid-row--gutters fr-mb-6v">
      <div className="fr-col-md-6 fr-col-12">
        <Form.TextInput
          aria-label="Profil GitHub"
          iconClassName="ri-github-fill"
          label="Comment tu le fais"
          name="githubUrl"
          placeholder="Profil GitHub"
        />
      </div>
      <div className="fr-col-md-6 fr-col-12 fr-mt-md-5v">
        <Form.TextInput aria-label="Portfolio" iconClassName="ri-link-m" name="portfolioUrl" placeholder="Portfolio" />
      </div>
    </div>

    <ActionBar className="fr-pt-md-16v">
      <Form.Submit>Valider</Form.Submit>
    </ActionBar>
  </Form>
)
