import { Fade, Stack, Tooltip } from "@mui/material"
import { DiamondsFour } from "@phosphor-icons/react"
import { useQuery } from "@tanstack/react-query"
import React from "react"

import { IdBlock } from "./IdBlock"
import { useArnsForEntityId } from "@/hooks/useArnsForEntityId"
import { getMessageById } from "@/services/messages-api"
import { truncateId } from "@/utils/data-utils"

type EntityBlockProps = { entityId: string; fullId?: boolean }

export function EntityBlock(props: EntityBlockProps) {
  const { entityId, fullId } = props

  const { data: message } = useQuery({
    queryKey: ["message", entityId],
    queryFn: () => getMessageById(entityId),
  })

  const arnsDomain = useArnsForEntityId(entityId)

  return (
    <Stack direction="row" gap={0.5} alignItems="center">
      {message?.type === "Process" && (
        <Fade in>
          <Tooltip title="Process">
            <DiamondsFour height={16} width={16} />
          </Tooltip>
        </Fade>
      )}
      <IdBlock
        label={arnsDomain ? arnsDomain : fullId ? entityId : truncateId(entityId)}
        value={entityId}
        href={`/entity/${entityId}`}
      />
    </Stack>
  )
}
