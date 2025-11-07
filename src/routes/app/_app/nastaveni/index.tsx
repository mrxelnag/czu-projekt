import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/app/_app/nastaveni/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/_app/nastaveni/"!</div>
}
