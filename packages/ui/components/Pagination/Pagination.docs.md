# Pagination Component

## Description

Page navigation controls for multi-page content. Provides previous/next buttons, individual page links, and ellipsis for large page counts. Purely presentational — you control navigation logic.

## When to Use

- Navigating through paginated list or table results
- Multi-step forms where each step has its own page
- Any content split across multiple pages requiring browser navigation

## Props

### PaginationLink

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isActive` | `boolean` | `false` | Highlights as the current page |
| `size` | `"default" \| "sm" \| "lg" \| "icon"` | `"icon"` | Link size |
| `href` | `string` | — | Target URL for this page |
| `onClick` | `() => void` | — | Click handler (use instead of `href` for SPA routing) |

All other sub-components accept standard HTML element attributes.

## Usage

```tsx
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis
} from '@repo/ui'

// Static links (full-page navigation)
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="/articles?page=1" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="/articles?page=1">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="/articles?page=2" isActive>2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="/articles?page=3">3</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="/articles?page=10">10</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="/articles?page=3" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

```tsx
// SPA routing with onClick handlers
const [page, setPage] = React.useState(1)
const totalPages = 10

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious
        onClick={() => setPage(p => Math.max(1, p - 1))}
        aria-disabled={page === 1}
      />
    </PaginationItem>
    {[page - 1, page, page + 1]
      .filter(p => p >= 1 && p <= totalPages)
      .map(p => (
        <PaginationItem key={p}>
          <PaginationLink isActive={p === page} onClick={() => setPage(p)}>
            {p}
          </PaginationLink>
        </PaginationItem>
      ))}
    <PaginationItem>
      <PaginationNext
        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
        aria-disabled={page === totalPages}
      />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

## Exports
- `Pagination`, `PaginationContent`, `PaginationItem`
- `PaginationLink`, `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis`
