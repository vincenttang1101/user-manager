import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type RefreshFunction<T> = () => Promise<T>;

export function createWithRefresh<T>(refreshFn: RefreshFunction<T>) {
  return function withRefresh<Args extends any[]>(
    operation: (...args: Args) => Promise<void>
  ) {
    return async (...args: Args): Promise<void> => {
      try {
        await operation(...args);
      } finally {
        await refreshFn();
      }
    };
  };
}
