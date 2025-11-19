export function extractErrorMessage(err: unknown): string {
  if (!err) return 'Unknown error'
  if (typeof err === 'string') return err
  if (err instanceof Error) return err.message
  // fallback to common shapes (h3 errors)
  const anyErr = err as { data?: { message?: string }; message?: string }
  console.log('anyErr'+anyErr);
  return anyErr?.data?.message || anyErr?.message || JSON.stringify(anyErr) || 'Unknown error'
}
