import { prisma } from '@api/libs/prisma'
import { Spacer } from '@app/atoms/Spacer'
import { TextInput } from '@app/atoms/TextInput'
import { Title } from '@app/atoms/Title'
import { stringifyDeepDates } from '@app/helpers/stringifyDeepDates'
import { InstitutionWithRelation } from '@app/organisms/InstitutionHeader'
import { InstitutionsList } from '@app/organisms/InstitutionsList'
import Head from 'next/head'
import { useState } from 'react'

type InstitutionPageProps = {
  institutions: InstitutionWithRelation[]
}

export default function InstitutionsListPage({ institutions }: InstitutionPageProps) {
  // TODO: should it be server side?
  const [filteredInstitutions, setFilteredInstitutions] = useState<InstitutionWithRelation[]>(institutions)

  const handleQuery = evt => {
    const query = evt.target.value

    if (query) {
      setFilteredInstitutions(
        institutions.filter(institution => institution.name.toLocaleLowerCase().includes(query.toLowerCase())),
      )
    } else {
      setFilteredInstitutions(institutions)
    }
  }

  return (
    <>
      <Head>
        <title>Institutions | Métiers du Numérique</title>
      </Head>

      <div className="fr-container fr-mb-12v fr-mt-16v">
        <Title as="h1">Institutions</Title>
        <Spacer units={1} />
        <div className="fr-col-8">
          <TextInput
            aria-label="Mot-clé"
            iconClassName="ri-search-line"
            name="query"
            onChange={handleQuery}
            placeholder="Rechercher par mot-clé"
          />
        </div>
        <Spacer units={1} />
        <InstitutionsList institutions={filteredInstitutions} />
      </div>
    </>
  )
}

export async function getStaticProps() {
  const institutions = await prisma.institution.findMany({
    include: {
      logoFile: true,
    },
    orderBy: {
      name: 'asc',
    },
    where: {
      description: { not: null },
      pageTitle: { not: null },
      testimonyTitle: { not: null },
    },
  })

  if (!institutions?.length) {
    return {
      notFound: true,
    }
  }

  const institutionsWithHumanDates = stringifyDeepDates(institutions)

  return {
    props: { institutions: institutionsWithHumanDates },
    revalidate: 300,
  }
}
