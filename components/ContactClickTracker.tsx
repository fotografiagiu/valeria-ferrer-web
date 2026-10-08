import { useEffect } from 'react'
import { track } from '@vercel/analytics'
import {
  handleDocumentContactClick,
  setContactTrackImpl,
} from '../lib/contactTracking'

/**
 * Global contact conversion tracker. Mount once inside the app shell (App).
 * Uses capture phase so events queue before tel: / target=_blank navigation.
 */
const ContactClickTracker: React.FC = () => {
  useEffect(() => {
    setContactTrackImpl((event, data) => {
      track(event, data as Record<string, string | number | boolean | null>)
    })

    const onClick = (event: MouseEvent) => {
      handleDocumentContactClick(event)
    }

    document.addEventListener('click', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      setContactTrackImpl(null)
    }
  }, [])

  return null
}

export default ContactClickTracker
