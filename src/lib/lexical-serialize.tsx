import React from 'react'

type LexicalTextNode = {
  type: 'text'
  text: string
  format?: number
}

type LexicalLinkNode = {
  type: 'link'
  fields?: { url?: string | null; newTab?: boolean | null }
  children?: LexicalNode[]
}

type LexicalElementNode = {
  type: string
  children?: LexicalNode[]
}

type LexicalNode = LexicalTextNode | LexicalLinkNode | LexicalElementNode

type LexicalEditorState = {
  root?: {
    children?: LexicalNode[]
  }
}

function serializeTextNode(node: LexicalTextNode, key: number): React.ReactNode {
  const { text, format = 0 } = node
  if (!format) return <React.Fragment key={key}>{text}</React.Fragment>

  let el: React.ReactNode = text
  if (format & 16) el = <code>{el}</code>
  if (format & 4)  el = <s>{el}</s>
  if (format & 8)  el = <u>{el}</u>
  if (format & 2)  el = <em>{el}</em>
  if (format & 1)  el = <strong>{el}</strong>

  return <React.Fragment key={key}>{el}</React.Fragment>
}

function serializeNode(node: LexicalNode, key: number): React.ReactNode {
  if (node.type === 'text') {
    return serializeTextNode(node as LexicalTextNode, key)
  }

  if (node.type === 'link') {
    const link = node as LexicalLinkNode
    const url = link.fields?.url ?? '#'
    const newTab = link.fields?.newTab ?? false
    return (
      <a
        key={key}
        href={url}
        target={newTab ? '_blank' : undefined}
        rel={newTab ? 'noopener noreferrer' : undefined}
        className="underline underline-offset-2 text-brand-700 hover:text-brand-950 transition-colors duration-150"
      >
        {(link.children ?? []).map((child, i) => serializeNode(child, i))}
      </a>
    )
  }

  if ('children' in node && Array.isArray(node.children)) {
    return (
      <React.Fragment key={key}>
        {node.children.map((child, i) => serializeNode(child, i))}
      </React.Fragment>
    )
  }

  return null
}

export function LexicalContent({ data }: { data: unknown }) {
  if (typeof data === 'string') return <>{data}</>

  const state = data as LexicalEditorState | null | undefined
  if (!state?.root?.children) return null

  const inlineNodes = state.root.children.flatMap((para) =>
    'children' in para && Array.isArray(para.children) ? para.children : [],
  )

  return (
    <>
      {inlineNodes.map((node, i) => serializeNode(node as LexicalNode, i))}
    </>
  )
}

function extractText(nodes: LexicalNode[]): string {
  return nodes
    .map((n) => {
      if (n.type === 'text') return (n as LexicalTextNode).text
      if ('children' in n && Array.isArray(n.children)) return extractText(n.children)
      return ''
    })
    .join('')
}

export function lexicalToPlainText(data: unknown): string {
  if (typeof data === 'string') return data

  const state = data as LexicalEditorState | null | undefined
  if (!state?.root?.children) return ''

  return state.root.children
    .map((para) =>
      'children' in para && Array.isArray(para.children)
        ? extractText(para.children)
        : '',
    )
    .join(' ')
    .trim()
}
