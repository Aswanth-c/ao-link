import { Paper, Stack, TableCell, TableRow, Tooltip } from "@mui/material"
import { Info } from "@phosphor-icons/react"
import React, { memo } from "react"

import { useNavigate } from "react-router-dom"

import { RetryableMsgCount } from "./RetryableMsgCount"
import { AsyncTable, AsyncTableProps, HeaderCell } from "@/components/AsyncTable"
import { IdBlock } from "@/components/IdBlock"
import { TypeBadge } from "@/components/TypeBadge"
import { AoMessage } from "@/types"
import { TYPE_PATH_MAP, truncateId } from "@/utils/data-utils"
import { formatFullDate, formatRelative } from "@/utils/date-utils"
import { formatNumber } from "@/utils/number-utils"

type ProcessesTableProps = Pick<AsyncTableProps, "fetchFunction" | "pageSize"> & {
  hideModuleColumn?: boolean
}

function BaseProcessesTable(props: ProcessesTableProps) {
  const { hideModuleColumn, ...rest } = props
  const navigate = useNavigate()

  const headerCells: HeaderCell[] = [
    { label: "Type", sx: { width: 140 } },
    { label: "ID", sx: { width: 240 } },
    { label: "Name" },
    // { label: "Tags" },
    { label: "Module" },
    { label: "Incoming messages", align: "right", sx: { width: 160 } },
    {
      label: "Arweave Block",
      sx: { width: 160 },
      align: "right",
    },
    {
      field: "ingestedAt" satisfies keyof AoMessage,
      label: (
        <Stack direction="row" gap={0.5} alignItems="center">
          Seen at
          <Tooltip title="Time when the message was seen by the Arweave network (ingested_at).">
            <Info width={16} height={16} />
          </Tooltip>
        </Stack>
      ),
      sx: { width: 160 },
      align: "right",
      sortable: true,
    },
  ]

  if (hideModuleColumn) {
    headerCells.splice(3, 1)
  }

  return (
    <AsyncTable
      {...rest}
      component={Paper}
      initialSortDir="desc"
      initialSortField="ingestedAt"
      headerCells={headerCells}
      renderRow={(item: AoMessage) => (
        <TableRow
          sx={{ cursor: "pointer" }}
          key={item.id}
          onClick={() => {
            navigate(`/${TYPE_PATH_MAP[item.type]}/${item.id}`)
          }}
        >
          <TableCell>
            <TypeBadge type={item.type} />
          </TableCell>
          <TableCell>
            <IdBlock label={truncateId(item.id)} value={item.id} href={`/entity/${item.id}`} />
          </TableCell>
          <TableCell>{item.tags["Name"]}</TableCell>
          {!hideModuleColumn && (
            <TableCell>
              <IdBlock
                label={truncateId(item.tags["Module"])}
                value={item.tags["Module"]}
                href={`/module/${item.tags["Module"]}`}
              />
            </TableCell>
          )}
          <TableCell align="right">
            <RetryableMsgCount processId={item.id} />
          </TableCell>
          <TableCell align="right">
            {item.blockHeight === null ? (
              "Processing"
            ) : (
              <IdBlock
                label={formatNumber(item.blockHeight)}
                value={String(item.blockHeight)}
                href={`/block/${item.blockHeight}`}
              />
            )}
          </TableCell>
          <TableCell align="right">
            {item.ingestedAt === null ? (
              "Processing"
            ) : (
              <Tooltip title={formatFullDate(item.ingestedAt)}>
                <span>{formatRelative(item.ingestedAt)}</span>
              </Tooltip>
            )}
          </TableCell>
        </TableRow>
      )}
    />
  )
}

export const ProcessesTable = memo(BaseProcessesTable)
