/* eslint-disable @next/next/no-head-element */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <head>
        <title>web3 login</title>
      </head>
      <body>{children}</body>
    </html>
  )
}
