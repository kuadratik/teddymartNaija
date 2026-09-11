const debounce = <T extends (...args: any[]) => unknown>(func: T, delay: number) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    const later = () => {
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, delay)
  }
}

export default debounce
