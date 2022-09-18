export interface Response {
  data: Data
}

export interface Data {
  repository: Repository
}

export interface Repository {
  name: string
  createdAt: Date
  refs: Refs
}

export interface Refs {
  edges: RefsEdge[]
}

export interface RefsEdge {
  node: PurpleNode
}

export interface PurpleNode {
  name: string
  target: Target
}

export interface Target {
  history: History
}

export interface History {
  edges: HistoryEdge[]
}

export interface HistoryEdge {
  node: FluffyNode
}

export interface FluffyNode {
  committedDate: Date
  author: Author
}

export interface Author {
  name: string
}
