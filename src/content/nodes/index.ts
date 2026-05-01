import type { NarrativeNode, NodeId } from '../../types'
import { ACT1_NODES } from './act1'
import { ACT2_FLORESTA_NODES } from './act2_floresta'
import { ACT2_CIDADE_NODES } from './act2_cidade'
import { ACT2_RUINAS_NODES } from './act2_ruinas'
import { ACT3_NODES } from './act3'

const ALL_NODES: NarrativeNode[] = [
  ...ACT1_NODES,
  ...ACT2_FLORESTA_NODES,
  ...ACT2_CIDADE_NODES,
  ...ACT2_RUINAS_NODES,
  ...ACT3_NODES,
]

export const NODE_MAP: Map<NodeId, NarrativeNode> = new Map(
  ALL_NODES.map((node) => [node.id, node]),
)

export function getNode(id: string): NarrativeNode | undefined {
  return NODE_MAP.get(id)
}

export {
  ACT1_NODES,
  ACT2_FLORESTA_NODES,
  ACT2_CIDADE_NODES,
  ACT2_RUINAS_NODES,
  ACT3_NODES,
}
