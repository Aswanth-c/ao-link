import { TableRow, Typography } from "@mui/material"
import { useRouter } from "next/navigation"
import React from "react"

import { IdBlock } from "@/components/IdBlock"
import { InMemoryTable } from "@/components/InMemoryTable"
import { MonoFontFF } from "@/components/RootLayout/fonts"
import { TypeBadge } from "@/components/TypeBadge"
import { NormalizedAoEvent } from "@/utils/ao-event-utils"
import { TYPE_PATH_MAP, truncateId } from "@/utils/data-utils"
import { formatFullDate, formatRelative } from "@/utils/date-utils"
import { formatNumber } from "@/utils/number-utils"

type MessagesTableProps = {
  data: NormalizedAoEvent[]
  loading?: boolean
}

export function MessagesTable(props: MessagesTableProps) {
  const { data, loading } = props
  const router = useRouter()

  return (
    <InMemoryTable
      loading={loading}
      headerCells={[
        { label: "Type", sx: { width: 120 } },
        { label: "Action" },
        { label: "ID", sx: { width: 220 } },
        { label: "From", sx: { width: 220 } },
        { label: "To", sx: { width: 220 } },
        {
          label: "Block Height",
          sx: { width: 160 },
          align: "right",
        },
        {
          field: "created",
          label: "Created",
          sx: { width: 160 },
          align: "right",
        },
      ]}
      initialSortDir="desc"
      initialSortField="created"
      data={data}
      renderRow={(item: NormalizedAoEvent) => (
        <TableRow
          className="table-row cursor-pointer"
          key={item.id}
          onClick={() => {
            router.push(`/${TYPE_PATH_MAP[item.type]}/${item.id}`)
          }}
        >
          <td className="text-start p-2">
            <TypeBadge type={item.type} />
          </td>
          <td className="text-start p-2 ">{item.action}</td>
          <td className="text-start p-2 ">
            <IdBlock
              label={truncateId(item.id)}
              value={item.id}
              href={`/message/${item.id}`}
            />
          </td>
          <td className="text-start p-2 ">
            <IdBlock
              label={truncateId(item.from)}
              value={item.from}
              href={`/entity/${item.from}`}
            />
          </td>
          <td className="text-start p-2 ">
            <IdBlock
              label={truncateId(item.to)}
              value={item.to}
              href={`/entity/${item.to}`}
            />
          </td>
          <td className="text-end p-2">
            <Typography
              fontFamily={MonoFontFF}
              component="div"
              variant="inherit"
            >
              <IdBlock
                label={formatNumber(item.blockHeight)}
                value={String(item.blockHeight)}
                href={`/block/${item.blockHeight}`}
              />
            </Typography>
          </td>
          <td className="text-end p-2">
            {/* TODO */}
            <span className="tooltip" data-tip={formatFullDate(item.created)}>
              {formatRelative(item.created)}
            </span>
          </td>
        </TableRow>
      )}
    />
  )
}
