import { Box, Paper, Typography, useTheme } from "@mui/material"
import AnsiToHtml from "ansi-to-html"
import React, { useMemo } from "react"

import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json"
import { github, vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs"

import { MonoFontFF } from "@/components/RootLayout/fonts"

SyntaxHighlighter.registerLanguage("json", json)

export function FormattedDataBlock(props: { data?: string; placeholder?: string }) {
  const { data: rawData, placeholder } = props

  const theme = useTheme()

  const [data, type] = useMemo(() => {
    if (!rawData) return [placeholder || "...", "string"]

    try {
      const json = JSON.parse(rawData)
      let formatted = JSON.stringify(json, null, 2)
      // if the json object has nested ansi strings, we strip them away
      formatted = formatted.replace(/\\u001b\[\d{1,2}(;\d{1,2})*m/g, "")
      return [formatted, "json"]
    } catch (error) {
      const ansiConverter = new AnsiToHtml()
      const formatted = ansiConverter.toHtml(rawData)
      return [formatted, "ansi"]
    }
  }, [rawData, placeholder])

  return (
    <Paper
      sx={(theme) => ({
        bgcolor: "var(--mui-palette-background-paper)",
        "& *": {
          ...theme.typography.body2,
          fontFamily: MonoFontFF,
        },
        "& > *": {
          minWidth: "100%",
          minHeight: 250,
          height: 250,
          resize: "vertical",
          margin: 0,
          padding: "12px !important",
        },
      })}
    >
      {type === "string" ? (
        <Box>
          <Typography color="text.secondary" variant="inherit">
            {data}
          </Typography>
        </Box>
      ) : type === "json" ? (
        <SyntaxHighlighter language="json" style={theme.palette.mode === "light" ? github : vs2015}>
          {data}
        </SyntaxHighlighter>
      ) : (
        <div
          dangerouslySetInnerHTML={{
            __html: data,
          }}
        />
      )}
    </Paper>
  )
}
