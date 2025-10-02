import { Navigate, useSearchParams } from "react-router-dom"

export default function ActivationRedirect() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const target = token
    ? `/app/account/activation?token=${encodeURIComponent(token)}`
    : "/app/account/activation"

  return <Navigate to={target} replace />
}

