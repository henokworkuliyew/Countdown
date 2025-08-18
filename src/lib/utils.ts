import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

declare global {
  var mongoose:
    | {
        conn: typeof import('mongoose') | null
        promise: Promise<typeof import('mongoose')> | null
      }
    | undefined
}
