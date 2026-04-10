export const useToast = () => {
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    // Simple console log for now - can be enhanced with a toast UI component
    console.log(`[${type.toUpperCase()}] ${message}`)
    alert(message)
  }
  
  return {
    show: showToast
  }
}
