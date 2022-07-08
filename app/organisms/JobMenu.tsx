import { theme } from '@app/theme'
import { MouseEvent, useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'

import type { JobWithRelation } from '@app/organisms/JobCard'

export const Placeholder = styled.div`
  display: none;

  @media screen and (min-width: 768px) {
    display: block;
    margin-right: 2rem;
    max-width: 20rem;
    min-width: 20rem;
    padding: 1rem;
  }
`

export const Box = styled.div`
  display: none;

  @media screen and (min-width: 768px) {
    background-color: ${theme.color.primary.lightBlue};
    display: block;
    padding: 1rem;
    position: absolute;
    width: 20rem;
    z-index: 1;

    a {
      font-size: ${theme.typography.desktop.body.normal};
    }
  }
`

const SPACING_IN_PX = 16

type JobMenuProps = {
  job: JobWithRelation
}
export function JobMenu({ job }: JobMenuProps) {
  const boxElementRef = useRef<HTMLDivElement>(null)
  const headerElementRef = useRef<HTMLDivElement>()
  const lastTitleElementRef = useRef<HTMLAnchorElement>()

  const scrollMe = useCallback(() => {
    if (!boxElementRef.current || !headerElementRef.current || !lastTitleElementRef.current) {
      return
    }

    const minScrollY = headerElementRef.current.offsetHeight + SPACING_IN_PX
    if (window.scrollY > minScrollY) {
      const maybeTopInPx = minScrollY + window.scrollY
      const maxTopInPx = lastTitleElementRef.current.offsetTop - SPACING_IN_PX
      const topInPx = maybeTopInPx > maxTopInPx ? lastTitleElementRef.current.offsetTop : maybeTopInPx

      boxElementRef.current.style.top = `${topInPx}px`
    } else {
      boxElementRef.current.style.top = ''
    }
  }, [])

  const scrollTo = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    if (!headerElementRef.current) {
      return
    }

    const targetedTitleElement = window.document.querySelector<HTMLElement>(event.currentTarget.hash)
    if (!targetedTitleElement) {
      return
    }

    const scrollToY = targetedTitleElement.offsetTop - headerElementRef.current.offsetHeight - SPACING_IN_PX

    window.scroll({
      behavior: 'smooth',
      top: scrollToY,
    })
  }, [])

  useEffect(() => {
    headerElementRef.current = window.document.querySelector<HTMLDivElement>('header') ?? undefined
    lastTitleElementRef.current = window.document.querySelector<HTMLAnchorElement>('#pour-candidater') ?? undefined

    window.document.addEventListener('scroll', scrollMe)

    return () => {
      window.document.removeEventListener('scroll', scrollMe)
    }
  }, [])

  return (
    <>
      <Placeholder />
      <Box ref={boxElementRef}>
        <p>
          <strong>Sommaire :</strong>
        </p>

        <ul>
          <li>
            <a href="#mission" onClick={scrollTo}>
              Mission
            </a>
          </li>
          {job.teamDescription && (
            <li>
              <a href="#equipe" onClick={scrollTo}>
                Équipe
              </a>
            </li>
          )}
          {job.contextDescription && (
            <li>
              <a href="#contexte" onClick={scrollTo}>
                Contexte
              </a>
            </li>
          )}
          {job.perksDescription && (
            <li>
              <a href="#avantages" onClick={scrollTo}>
                Avantages
              </a>
            </li>
          )}
          {job.tasksDescription && (
            <li>
              <a href="#role" onClick={scrollTo}>
                Rôle
              </a>
            </li>
          )}
          {job.profileDescription && (
            <li>
              <a href="#profil-recherche" onClick={scrollTo}>
                Profil recherché
              </a>
            </li>
          )}
          {job.particularitiesDescription && (
            <li>
              <a href="#conditions-particulieres" onClick={scrollTo}>
                Conditions particulières
              </a>
            </li>
          )}
          <li>
            <a href="#pour-candidater" onClick={scrollTo}>
              Pour candidater
            </a>
          </li>
        </ul>
      </Box>
    </>
  )
}
