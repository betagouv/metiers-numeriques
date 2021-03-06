import { Title } from '@app/atoms/Title'
import { Form } from '@app/molecules/Form'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback } from 'react'
import styled from 'styled-components'
import * as Yup from 'yup'

import type { FormikValues } from 'formik'

const FormSchema = Yup.object().shape({
  query: Yup.string().trim().required(`N’oubliez pas le mot-clé 😉.`),
})

const Box = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 2rem 0;
`

const Content = styled.div`
  @media screen and (min-width: 768px) {
    width: 50%;
  }
`

const Picture = styled.div`
  display: none;

  @media screen and (min-width: 768px) {
    display: flex;
  }
`

const StyledForm = styled(Form)`
  align-items: flex-start;
  display: flex;
  margin-top: 3rem;

  > .TextInput {
    flex-grow: 1;
  }
  > .Button {
    margin-left: 1rem;
  }
`

export function JobSearchBar() {
  const router = useRouter()

  const goToJobList = useCallback(({ query }: FormikValues) => {
    const urlSearchParams = new URLSearchParams({
      query,
    })
    router.push(`/offres-emploi?${urlSearchParams.toString()}`)
  }, [])

  return (
    <Box>
      <Content>
        <Title as="h2" isFirst>
          Tu es un talent du numérique ?<br />
          Mets tes compétences
          <br />
          au service des citoyens !
        </Title>

        <StyledForm initialValues={{}} onSubmit={goToJobList} validationSchema={FormSchema}>
          <Form.TextInput aria-label="Mot-clé" name="query" placeholder="Développeur" />
          <Form.Submit>Chercher</Form.Submit>
        </StyledForm>
      </Content>

      <Picture>
        <Image height="475" layout="intrinsic" priority src="/images/home-hero-illu.svg" width="470" />
      </Picture>
    </Box>
  )
}
