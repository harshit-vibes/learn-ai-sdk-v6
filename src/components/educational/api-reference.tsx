'use client'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface ApiItem {
  name: string
  type: string
  required?: boolean
  default?: string
  description: string
}

interface ApiReferenceProps {
  title?: string
  items: ApiItem[]
}

export function ApiReference({ title = 'API Reference', items }: ApiReferenceProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[150px]">Name</TableHead>
              <TableHead className="w-[180px]">Type</TableHead>
              <TableHead className="w-[100px]">Required</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.name}>
                <TableCell className="font-mono text-sm text-primary">
                  {item.name}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {item.type}
                </TableCell>
                <TableCell>
                  {item.required ? (
                    <Badge variant="destructive" className="text-xs">Required</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">Optional</Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {item.description}
                  {item.default && (
                    <span className="text-muted-foreground">
                      {' '}(default: <code className="text-xs">{item.default}</code>)
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
