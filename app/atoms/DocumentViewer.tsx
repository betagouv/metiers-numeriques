import React from 'react'

type DocumentViewerProps = {
  url: string
}

export const DocumentViewer = ({ url }: DocumentViewerProps) => (
  <object data={url} style={{ height: '100%' }} type="application/pdf">
    <iframe src="https://docs.google.com/viewer?url=your_url_to_pdf&embedded=true" title="Candidate CV" />
  </object>
)
