"use client"

import {
  Avatar,
  Box,
  Paper,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material"
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import React, { useState } from "react"

import { IdBlock } from "@/components/IdBlock"
import { SectionInfo } from "@/components/SectionInfo"
import { TokenAmountBlock } from "@/components/TokenAmountBlock"
import { TokenInfo, TokenHolder } from "@/services/token-api"

import { TokenHolderChart } from "./TokenHolderChart"
import { TokenHolderTable } from "./TokenHolderTable"

type TokenPageProps = {
  tokenInfo: TokenInfo
  tokenHolders: TokenHolder[]
}

export const dynamic = "force-dynamic"

export default function TokenPage(props: TokenPageProps) {
  const { tokenInfo, tokenHolders } = props

  const circulatingSupply = tokenHolders.reduce(
    (acc, holder) => acc + holder.balance,
    0,
  )

  const [activeTab, setActiveTab] = useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  return (
    <Stack component="main" gap={4} paddingY={4}>
      <div className="flex gap-2 items-center text-sm">
        <p className="text-[#9EA2AA]">TOKEN</p>
        <p className="font-bold">/</p>
        <IdBlock label={tokenInfo.processId} />
      </div>
      <Box sx={{ marginX: 1 }}>
        <Grid2 container spacing={{ xs: 4 }}>
          <Grid2 xs={12} lg={6}>
            <Stack direction="row" gap={1} alignItems="center">
              <Avatar
                src={`https://arweave.net/${tokenInfo.logo}`}
                alt={tokenInfo.name}
                sx={{ width: 48, height: 48 }}
              />
              <Stack>
                <Tooltip title="Name" placement="right">
                  <Typography variant="h6" lineHeight={1.15}>
                    {tokenInfo.name}
                  </Typography>
                </Tooltip>
                <Tooltip title="Ticker" placement="right">
                  <Typography
                    variant="body2"
                    lineHeight={1.15}
                    color="text.secondary"
                  >
                    {tokenInfo.ticker}
                  </Typography>
                </Tooltip>
              </Stack>
            </Stack>
          </Grid2>
          <Grid2 xs={12} lg={6}>
            <Stack justifyContent="center" height="100%">
              <SectionInfo title="Token holders" value={tokenHolders.length} />
              <SectionInfo
                title="Circulating supply"
                value={
                  <TokenAmountBlock
                    amount={circulatingSupply}
                    tokenInfo={tokenInfo}
                  />
                }
              />
            </Stack>
          </Grid2>
        </Grid2>
      </Box>
      <div>
        <Tabs
          value={activeTab}
          onChange={handleChange}
          textColor="primary"
          // indicatorColor="secondary"
        >
          <Tab value={0} label="Token Holders Table" />
          <Tab value={1} label="Token Holders Chart" />
        </Tabs>
        <Paper>
          {activeTab === 0 && (
            <TokenHolderTable data={tokenHolders} tokenInfo={tokenInfo} />
          )}
          {activeTab === 1 && (
            <TokenHolderChart data={tokenHolders} tokenInfo={tokenInfo} />
          )}
        </Paper>
      </div>
    </Stack>
  )
}