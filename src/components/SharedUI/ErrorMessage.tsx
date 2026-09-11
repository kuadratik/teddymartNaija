const ErrorMessage = ({ children }: { children: string }) => {
  return <p className="relative flex translate-y-0.5 flex-col gap-1 text-xs italic text-error-50">{children}</p>
}

export default ErrorMessage
