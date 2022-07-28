/* eslint-disable sort-keys-fix/sort-keys-fix */
import { Button } from '@app/atoms/Button'
import { Spacer } from '@app/atoms/Spacer'
import { Title } from '@app/atoms/Title'
import { Form } from '@app/molecules/Form'
import { ActionBar } from '@app/organisms/Profile/ActionBar'
import { JOB_CONTRACT_TYPES_AS_OPTIONS, REGIONS_AS_OPTIONS } from '@common/constants'
import { FormikValues } from 'formik'
import React from 'react'
import * as Yup from 'yup'

const FormSchema = Yup.object().shape({
  domainIds: Yup.array(Yup.string().nullable())
    .required(`Au moins un domaine est obligatoire.`)
    .min(1, `Au moins un domaine est obligatoire.`),
  hiddenFromInstitutions: Yup.array(Yup.string().nullable()).nullable(),
  region: Yup.string().required('Ce champ est obligatoire'),
  contractTypes: Yup.array(Yup.string().nullable())
    .required(`Au moins un type de contrat est obligatoire.`)
    .min(1, `Au moins un type de contrat est obligatoire.`),
})

type Props = {
  initialValues: FormikValues
  onNext: (values: FormikValues) => void
  onPrevious: () => void
}

export const PreferencesForm = ({ initialValues, onNext, onPrevious }: Props) => (
  <Form initialValues={initialValues} onSubmit={onNext} validationSchema={FormSchema}>
    <Title as="h1">Ton Profil 2/2</Title>
    <Spacer units={2} />
    <div className="fr-grid-row fr-grid-row--gutters fr-mb-md-6v fr-mb-3v">
      <div className="fr-col-md-6 fr-col-12">
        <Form.Select label="Localisation" name="region" options={REGIONS_AS_OPTIONS} placeholder="Normandie" />
      </div>
      <div className="fr-col-md-6 fr-col-12">
        <Form.Select
          isMulti
          label="Type de contrat recherché"
          name="contractTypes"
          options={JOB_CONTRACT_TYPES_AS_OPTIONS}
          placeholder="Fonctionnaire, Contractuel"
        />
      </div>
    </div>

    <div className="fr-grid-row fr-grid-row--gutters fr-mb-md-6v fr-mb-3v">
      <div className="fr-col-12">
        <Form.DomainSelect
          aria-label="Domaines"
          isMulti
          label="Domaines qui m'intéressent"
          name="domainIds"
          placeholder="Ecologie, Education, Justice"
        />
      </div>
    </div>

    <div className="fr-grid-row fr-grid-row--gutters fr-mb-6v">
      <div className="fr-col-12">
        <Form.InstitutionSelect
          aria-label="Hidden Institutions"
          isMulti
          label="Cacher ma candidature à ces institutions"
          name="hiddenFromInstitutions"
        />
      </div>
    </div>

    <ActionBar className="fr-pt-md-16v">
      <Button accent="secondary" onClick={onPrevious}>
        Retour
      </Button>
      <Form.Submit>Valider</Form.Submit>
    </ActionBar>
  </Form>
)
