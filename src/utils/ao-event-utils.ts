import { type AoEvent } from "@/services/aoscan"

import { parseUtcString } from "./date-utils"

export type NormalizedAoEvent = {
  id: string
  type: "Message" | "Process"
  messageId: string
  processId: string
  owner: string
  blockHeight: number
  schedulerId: string
  created: Date
  action: string
}

export function normalizeAoEvent(event: AoEvent): NormalizedAoEvent {
  const { owner_address, id, tags_flat, height, created_at, target } = event
  const { Action, Type, Scheduler } = tags_flat
  //
  const type = Type as NormalizedAoEvent["type"]
  const blockHeight = height
  const owner = owner_address
  const schedulerId = Scheduler
  const action = Action
  const created = parseUtcString(created_at)
  //
  const processId = type === "Message" ? target : id
  const messageId = type === "Message" ? id : ""

  return {
    id,
    type,
    messageId,
    owner,
    processId,
    blockHeight,
    schedulerId,
    created,
    action,
  }
}

export function normalizeTags(tags: Record<string, any>): Record<string, any> {
  const { Tags, ...rest } = tags

  try {
    if (Tags) {
      return { ...rest, ...JSON.parse(Tags) }
    }
  } catch {}

  return tags
}
