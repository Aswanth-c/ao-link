import { Box, Collapse, IconButton, Paper, TableCell, TableRow, Tooltip } from "@mui/material"

import { CaretDown, CaretRight } from "@phosphor-icons/react"
import { useEffect, useState } from "react"

import { EntityBlock } from "@/components/EntityBlock"
import { FormattedDataBlock } from "@/components/FormattedDataBlock"
import { IdBlock } from "@/components/IdBlock"
import { TypeBadge } from "@/components/TypeBadge"
import { AoMessage } from "@/types"
import { truncateId } from "@/utils/data-utils"
import { formatFullDate, formatRelative } from "@/utils/date-utils"
import { formatNumber } from "@/utils/number-utils"

type EvalMessagesTableRowProps = {
  item: AoMessage
  expandedByDefault?: boolean
}

export function EvalMessagesTableRow(props: EvalMessagesTableRowProps) {
  const { item: message, expandedByDefault } = props

  const [expanded, setExpanded] = useState(!!expandedByDefault)
  const [data, setData] = useState<string>("Loading...")

  useEffect(() => {
    if (!message || !expanded) return

    if (message.type === "Checkpoint") {
      setData("Message too long")
    } else {
      fetch(`https://arweave.net/${message.id}`)
        .then((res) => res.text())
        .then(setData)
    }
  }, [message, expanded])

  return (
    <>
      <TableRow
        hover={false}
        onClick={() => setExpanded(!expanded)}
        sx={{
          cursor: "pointer",
        }}
      >
        <TableCell>
          <TypeBadge type={message.type} />
        </TableCell>
        <TableCell>
          <IdBlock
            label={truncateId(message.id)}
            value={message.id}
            href={`/message/${message.id}`}
          />
        </TableCell>
        <TableCell>{message.action}</TableCell>
        <TableCell>
          <EntityBlock entityId={message.from} fullId />
        </TableCell>
        <TableCell align="right">
          {message.blockHeight === null ? (
            "Processing"
          ) : (
            <IdBlock
              label={formatNumber(message.blockHeight)}
              value={String(message.blockHeight)}
              href={`/block/${message.blockHeight}`}
            />
          )}
        </TableCell>
        <TableCell align="right">
          {message.created === null ? (
            "Processing"
          ) : (
            <Tooltip title={formatFullDate(message.created)}>
              <span>{formatRelative(message.created)}</span>
            </Tooltip>
          )}
        </TableCell>
        <TableCell>
          <IconButton size="small">{expanded ? <CaretDown /> : <CaretRight />}</IconButton>
        </TableCell>
      </TableRow>
      <TableRow hover={false}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Box
            sx={{
              marginX: -2,
            }}
          >
            <Collapse in={expanded} unmountOnExit>
              <FormattedDataBlock
                data={data}
                isEvalMessage
                component={Paper}
                placeholder=" "
                minHeight="unset"
              />
            </Collapse>
          </Box>
        </TableCell>
      </TableRow>
    </>
  )
}