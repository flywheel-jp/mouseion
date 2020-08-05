/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

interface GoogleError {
  code: number
  message: string
}

export default (e: any): e is GoogleError => {
  return (
    e != null && typeof e.code === "number" && typeof e.message === "string"
  )
}
