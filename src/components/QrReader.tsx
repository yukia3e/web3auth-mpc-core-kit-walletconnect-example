import { Button, Loading } from '@nextui-org/react'
import { Fragment, useState } from 'react'
import ReactQrReader from 'react-qr-reader-es6'

/**
 * Types
 */
interface IProps {
  onConnect: (uri: string) => Promise<void>
}

/**
 * Component
 */
export default function QrReader({ onConnect }: IProps) {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  function onError() {
    setShow(false)
  }

  async function onScan(data: string | null) {
    if (data) {
      await onConnect(data)
      setShow(false)
    }
  }

  function onShowScanner() {
    setLoading(true)
    setShow(true)
  }

  return (
    <div className="container">
      {show ? (
        <Fragment>
          {loading && <Loading css={{ position: 'absolute' }} />}
          <div className="qrVideoMask">
            <ReactQrReader
              onLoad={() => setLoading(false)}
              showViewFinder={false}
              onError={onError}
              onScan={onScan}
              style={{ width: '100%' }}
            />
          </div>
        </Fragment>
      ) : (
        <div className="container qrPlaceholder">
          qr
          <Button
            color="gradient"
            css={{ marginTop: '$10', width: '100%' }}
            onClick={onShowScanner}
          >
            Scan QR code
          </Button>
        </div>
      )}
    </div>
  )
}
