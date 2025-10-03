import { useEffect } from 'react'
import { bootstrapFlashMessages } from '../../scripts/flash-messages.js'

const FlashMessenger = () => {
  useEffect(() => {
    const teardown = bootstrapFlashMessages()
    return () => {
      if (typeof teardown === 'function') teardown()
    }
  }, [])

  return null
}

export default FlashMessenger
