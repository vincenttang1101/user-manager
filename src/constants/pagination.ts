export const PaginationConfig = {
  DEFAULT_PAGE_INDEX: 1,
  DEFAULT_PAGE_SIZE: 6,
  DEFAULT_TOTAL_PAGES: 1,
} as const;

export type PaginationConfigType = typeof PaginationConfig;
