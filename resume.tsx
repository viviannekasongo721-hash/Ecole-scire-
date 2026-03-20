import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/resume')({
  component: () => <Navigate to="/about" />,
})
